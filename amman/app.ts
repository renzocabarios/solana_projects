import {
  Amman,
  LOCALHOST,
  AMMAN_EXPLORER,
} from "@metaplex-foundation/amman-client";
import { Connection } from "@solana/web3.js";
import {
  percentAmount,
  generateSigner,
  signerIdentity,
  TransactionBuilderSendAndConfirmOptions,
  transactionBuilder,
  createSignerFromKeypair,
  Umi,
  Keypair,
  Signer,
  KeypairSigner,
} from "@metaplex-foundation/umi";
import {
  TokenStandard,
  createAndMint,
  mplTokenMetadata,
  CreateV1InstructionDataArgs,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";
import {
  fromWeb3JsKeypair,
  toWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import {
  findAssociatedTokenPda,
  transferTokens as transferTokensUmi,
  createAssociatedToken,
} from "@metaplex-foundation/mpl-toolbox";

type TokenMetadata = Pick<
  CreateV1InstructionDataArgs,
  "name" | "symbol" | "uri"
>;
type MetaplexFile = Readonly<{
  buffer: Buffer;
  fileName: string;
  displayName: string;
  uniqueName: string;
  contentType: string | null;
  extension: string | null;
  tags: [];
}>;
type OffchainMetadata = {
  name: string;
  symbol: string;
  image: string;
  description: string;
  creator: {
    name: string;
    site: string;
  };
};
const AIRDROP_AMOUNT = 100; // 100 SOL
const TOKEN_DECIMALS = 5;
const INITIAL_MINT_AMOUNT = 1_000_000 * Math.pow(10, TOKEN_DECIMALS); // 1 million tokens
const TRANSFER_AMOUNT = 100 * Math.pow(10, TOKEN_DECIMALS); // 100 tokens

const STORAGE_ID = "mock-storage";

const DEFAULT_OPTIONS: TransactionBuilderSendAndConfirmOptions = {
  send: { skipPreflight: true },
  confirm: { commitment: "processed" },
};

const OFF_CHAIN_METADATA: OffchainMetadata = {
  name: "Fake Bonk",
  symbol: "xBONK",
  image: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
  description: "The FAKE Bonk Inu token",
  creator: {
    name: "QuickNode Guides",
    site: "https://www.quicknode.com/guides/",
  },
};

async function setupUmi(): Promise<Umi> {
  const connection = new Connection(LOCALHOST);
  const umi = createUmi(connection);
  umi.use(mplTokenMetadata());
  return umi;
}

async function setupAuthority(
  umi: Umi,
  amman: Amman,
  connection: Connection
): Promise<[Umi, Keypair]> {
  const [_authorityPublicKey, authorityKeypair] = await amman.genLabeledKeypair(
    "Authority"
  );
  const authority = fromWeb3JsKeypair(authorityKeypair);
  const authoritySigner = createSignerFromKeypair(umi, authority);
  umi.use(signerIdentity(authoritySigner));
  await airdropSol(umi, authority, amman, connection);
  return [umi, authority];
}

async function airdropSol(
  umi: Umi,
  authority: Keypair,
  amman: Amman,
  connection: Connection
): Promise<void> {
  try {
    await amman.airdrop(
      connection,
      toWeb3JsPublicKey(authority.publicKey),
      AIRDROP_AMOUNT
    );
    console.log(
      `✅ - Airdropped ${AIRDROP_AMOUNT} SOL to ${authority.publicKey}`
    );
  } catch (err) {
    console.error("❌ - Error airdropping SOL:", err);
  }
}

async function uploadTokenMetadata(
  amman: Amman,
  tokenMetadata: OffchainMetadata
): Promise<string> {
  const storage = amman.createMockStorageDriver(STORAGE_ID, 1);

  const file: MetaplexFile = {
    buffer: Buffer.from(JSON.stringify(tokenMetadata)),
    fileName: "xBONK.json",
    displayName: "xBONK.json",
    uniqueName: "xBONK.json",
    contentType: "application/json",
    extension: "json",
    tags: [],
  };

  try {
    const uploadResponse = await storage.upload(file);
    console.log(`✅ - Successfully uploaded metadata`);
    return uploadResponse;
  } catch (err) {
    console.error("❌ - Error uploading metadata:", err);
    throw err;
  }
}
async function mintTokens(
  umi: Umi,
  mint: Signer,
  authority: Keypair,
  metadata: TokenMetadata
): Promise<void> {
  try {
    const response = await createAndMint(umi, {
      mint,
      authority: umi.identity,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      sellerFeeBasisPoints: percentAmount(0),
      decimals: TOKEN_DECIMALS,
      amount: INITIAL_MINT_AMOUNT,
      tokenOwner: authority.publicKey,
      tokenStandard: TokenStandard.Fungible,
    })
      .useLegacyVersion()
      .sendAndConfirm(umi, DEFAULT_OPTIONS);
    console.log(
      `✅ - Successfully minted ${
        INITIAL_MINT_AMOUNT / Math.pow(10, TOKEN_DECIMALS)
      } tokens (${mint.publicKey})`
    );
    const [signature] = base58.deserialize(response.signature);
    console.log(`     ${AMMAN_EXPLORER}/#/tx/${signature}`);
  } catch (err) {
    console.error("❌ - Error minting tokens:", err);
  }
}

async function transferTokens(
  umi: Umi,
  mint: Signer,
  authority: Keypair,
  receiver: KeypairSigner
): Promise<void> {
  const [senderAta] = findAssociatedTokenPda(umi, {
    mint: mint.publicKey,
    owner: authority.publicKey,
  });
  const [receiverAta] = findAssociatedTokenPda(umi, {
    mint: mint.publicKey,
    owner: receiver.publicKey,
  });

  const createAtaInstruction = createAssociatedToken(umi, {
    payer: umi.identity,
    owner: receiver.publicKey,
    mint: mint.publicKey,
    ata: receiverAta,
  });

  const transferInstruction = transferTokensUmi(umi, {
    source: senderAta,
    destination: receiverAta,
    amount: TRANSFER_AMOUNT,
  });

  const transferTransaction = transactionBuilder()
    .add(createAtaInstruction)
    .add(transferInstruction);

  try {
    const response = await transferTransaction
      .useLegacyVersion()
      .sendAndConfirm(umi, DEFAULT_OPTIONS);
    if (response.result.value.err) {
      throw new Error(JSON.stringify(response.result.value.err));
    }
    console.log(
      `✅ - Successfully transferred ${
        TRANSFER_AMOUNT / Math.pow(10, TOKEN_DECIMALS)
      } tokens`
    );
    const [signature] = base58.deserialize(response.signature);
    console.log(`     ${AMMAN_EXPLORER}/#/tx/${signature}`);
  } catch (err) {
    console.error("❌ - Error sending tokens:", err);
  }
}

async function main() {
  const amman = Amman.instance();
  const connection = new Connection(LOCALHOST, "processed");
  let umi = await setupUmi();

  const [updatedUmi, authority] = await setupAuthority(umi, amman, connection);
  umi = updatedUmi;

  const mint = generateSigner(umi);
  const receiver = generateSigner(umi);

  const [senderAta] = findAssociatedTokenPda(umi, {
    mint: mint.publicKey,
    owner: authority.publicKey,
  });
  const [receiverAta] = findAssociatedTokenPda(umi, {
    mint: mint.publicKey,
    owner: receiver.publicKey,
  });

  amman.addr.addLabel("xBONK", toWeb3JsPublicKey(mint.publicKey));
  amman.addr.addLabel("Receiver Wallet", toWeb3JsPublicKey(receiver.publicKey));
  amman.addr.addLabel("Sender xBONK Account", toWeb3JsPublicKey(senderAta));
  amman.addr.addLabel("Receiver xBONK Account", toWeb3JsPublicKey(receiverAta));

  const uri = await uploadTokenMetadata(amman, OFF_CHAIN_METADATA);

  const metadata: TokenMetadata = {
    name: "FakeBONK",
    symbol: "xBONK",
    uri,
  };

  await mintTokens(umi, mint, authority, metadata);
  await transferTokens(umi, mint, authority, receiver);
}

main().then(() => console.log("Done."));
