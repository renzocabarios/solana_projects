import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";

export function getProgram<T extends Idl = Idl>({
  connection,
  wallet,
  IDL,
  programId,
}: any) {
  const provider = new AnchorProvider(connection, wallet, {});
  return new Program<T>(IDL, programId, provider);
}
