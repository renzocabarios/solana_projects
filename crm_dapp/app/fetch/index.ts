import { IProgram } from "@/interfaces";

export async function getAllCustomers(program: IProgram) {
  return await program.account.customer.all();
}
