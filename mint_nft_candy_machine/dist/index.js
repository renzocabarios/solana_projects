"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const mpl_toolbox_1 = require("@metaplex-foundation/mpl-toolbox");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const bs58_1 = __importDefault(require("bs58"));
const mpl_toolbox_2 = require("@metaplex-foundation/mpl-toolbox");
const umi_2 = require("@metaplex-foundation/umi");
const nodewallet_js_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet.js"));
const umi_signer_wallet_adapters_1 = require("@metaplex-foundation/umi-signer-wallet-adapters");
const candyMachineAddress = (0, umi_1.publicKey)("3s9YNzgmF2vLsSPmPKVmgEugtDEpgndbomATLeXjsdRA");
const keypair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("3e4Ve7ofQxXCLqR9iRrEXQQRJLUNKJG9FxQQdAuhzdSZy8A2QJawqQTN135qKHb71Hd2R2uRon4x4AcMNPWQVgEE"));
const wallet = new nodewallet_js_1.default(keypair);
const walletIDentity = (0, umi_signer_wallet_adapters_1.walletAdapterIdentity)(wallet);
const umi = (0, umi_bundle_defaults_1.createUmi)((0, web3_js_1.clusterApiUrl)("devnet"))
    .use(walletIDentity)
    .use((0, mpl_candy_machine_1.mplCandyMachine)())
    .use((0, mpl_token_metadata_1.mplTokenMetadata)());
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const candyMachine = yield (0, mpl_candy_machine_1.fetchCandyMachine)(umi, candyMachineAddress);
    const candyGuard = yield (0, mpl_candy_machine_1.safeFetchCandyGuard)(umi, candyMachine.mintAuthority);
    console.log(candyGuard);
    const nftMint = (0, umi_2.generateSigner)(umi);
    const nftOwner = (0, umi_2.generateSigner)(umi).publicKey;
    yield (0, umi_2.transactionBuilder)()
        .add((0, mpl_toolbox_1.setComputeUnitLimit)(umi, { units: 1000000 }))
        .add((0, mpl_toolbox_2.createMintWithAssociatedToken)(umi, { mint: nftMint, owner: nftOwner }))
        .add((0, mpl_candy_machine_1.mintV2)(umi, {
        candyMachine: candyMachine.publicKey,
        candyGuard: candyGuard === null || candyGuard === void 0 ? void 0 : candyGuard.publicKey,
        nftMint: nftMint.publicKey,
        collectionMint: candyMachine.collectionMint,
        tokenStandard: candyMachine.tokenStandard,
        collectionUpdateAuthority: candyMachine.authority,
    }))
        .sendAndConfirm(umi);
});
start();
