import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Votingdapp } from "../target/types/votingdapp";

describe("votingdapp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Votingdapp as Program<Votingdapp>;


  const [pollAddress] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const [candidateAddress] = PublicKey.findProgramAddressSync(
    [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Candidate")],
    program.programId
  );

  it("Initialize Poll", async () => {

    await program.methods
      .initializePoll(
        new anchor.BN(1),
        new anchor.BN(0),
        new anchor.BN(new Date().getTime()),
        "test"
      )
      .accounts({
        signer: payer.publicKey,
      })
      .rpc();

    const currentPoll = await program.account.poll.fetch(pollAddress);

    expect(currentPoll.pollId.toNumber()).toEqual(1);
    expect(currentPoll.candidateAmount.toNumber()).toEqual(0);
    expect(currentPoll.description).toEqual("test");
    expect(currentPoll.pollStart.toNumber()).toBeLessThan(
      currentPoll.pollEnd.toNumber()
    );
  });

  it("Initialize Candidate", async () => {
    await program.methods
      .initializeCandidate(
        new anchor.BN(1),
        "Candidate"
      )
      .accounts({
        poll: pollAddress
      })
      .rpc();


    const currentCandidate = await program.account.candidate.fetch(candidateAddress);

    expect(currentCandidate.candidateName).toEqual("Candidate");
    expect(currentCandidate.candidateVotes.toNumber()).toEqual(0);
  });


  it("Initialize Vote", async () => {
    await program.methods
      .vote(
        new anchor.BN(1),
        "Candidate"
      )
      .accounts({
      })
      .rpc();


    const currentCandidate = await program.account.candidate.fetch(candidateAddress);
    expect(currentCandidate.candidateVotes.toNumber()).toEqual(1);
  });
});
