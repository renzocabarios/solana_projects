import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function AppBar() {
  return (
    <div className="h-[10vh] p-5 flex items-center justify-between">
      <p className="text-2xl font-semibold">Solana Examples</p>
      <WalletMultiButton />
    </div>
  );
}
