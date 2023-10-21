import { AccountBalance, Navbar } from "@/components";
import { Connection } from "@solana/web3.js";

export default function Home() {
  const connection = new Connection("https://api.devnet.solana.com");

  return (
    <main>
      <Navbar />
      <AccountBalance />
    </main>
  );
}
