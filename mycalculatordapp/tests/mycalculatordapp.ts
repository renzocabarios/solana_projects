import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Mycalculatordapp } from "../target/types/mycalculatordapp";
import { assert } from "chai";

describe("mycalculatordapp", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  const program = anchor.workspace
    .Mycalculatordapp as Program<Mycalculatordapp>;

  const keyPair = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    const greet: string = "Hello World";

    await program.methods
      .initialize(greet)
      .accounts({
        calculator: keyPair.publicKey,
        user: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([keyPair])
      .rpc();

    const { greeting } = await program.account.calculator.fetch(
      keyPair.publicKey
    );
    assert.ok(greeting === greet);
  });

  it("Should add numbers", async () => {
    const num1 = 10;
    const num2 = 20;

    await program.methods
      .add(new anchor.BN(num1), new anchor.BN(num2))
      .accounts({
        calculator: keyPair.publicKey,
      })
      .rpc();

    const { result } = await program.account.calculator.fetch(
      keyPair.publicKey
    );

    assert.ok(result.eq(new anchor.BN(num1 + num2)));
  });

  it("Should subtract numbers", async () => {
    const num1 = 20;
    const num2 = 1;

    await program.methods
      .subtract(new anchor.BN(num1), new anchor.BN(num2))
      .accounts({
        calculator: keyPair.publicKey,
      })
      .rpc();

    const { result } = await program.account.calculator.fetch(
      keyPair.publicKey
    );

    assert.ok(result.eq(new anchor.BN(num1 - num2)));
  });

  it("Should multiply numbers", async () => {
    const num1 = 10;
    const num2 = 10;

    await program.methods
      .multiply(new anchor.BN(num1), new anchor.BN(num2))
      .accounts({
        calculator: keyPair.publicKey,
      })
      .rpc();

    const { result } = await program.account.calculator.fetch(
      keyPair.publicKey
    );

    assert.ok(result.eq(new anchor.BN(num1 * num2)));
  });

  it("Should divide numbers", async () => {
    const num1 = 100;
    const num2 = 10;

    await program.methods
      .divide(new anchor.BN(num1), new anchor.BN(num2))
      .accounts({
        calculator: keyPair.publicKey,
      })
      .rpc();

    const { result, remainder } = await program.account.calculator.fetch(
      keyPair.publicKey
    );

    assert.ok(result.eq(new anchor.BN(num1 / num2)));
    assert.ok(remainder.eq(new anchor.BN(num1 % num2)));
  });
});
