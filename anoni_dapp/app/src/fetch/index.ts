import { IProgram } from "../interfaces";

export async function getAllPosts(program: IProgram) {
  return await program.account.post.all();
}
