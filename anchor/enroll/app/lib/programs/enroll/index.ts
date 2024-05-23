import { PublicKey } from "@solana/web3.js";
import { getProgram } from "@/lib/programs";
import { ENROLL_IDL, ENROLL_PROGRAM_ID } from "@/lib/programs/enroll/idl";

export function getEnrolls(enrollee: PublicKey) {
  const [enrollment] = PublicKey.findProgramAddressSync(
    [Buffer.from("enroll"), enrollee.toBuffer()],
    new PublicKey("FDDbT6pAmifx3GffUhq67FZBEZp1ggYmhdiWwAoJRY5T")
  );

  return enrollment;
}

export function getEnrollProgram({ connection, wallet, IDL }: any) {
  return getProgram<ENROLL_IDL>({
    connection,
    wallet,
    IDL: ENROLL_IDL,
    programId: ENROLL_PROGRAM_ID,
  });
}
