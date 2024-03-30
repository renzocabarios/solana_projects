import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

interface InputFieldProps {
  onChange: (e: any) => void;
  label: string;
  name: string | undefined;
  type: React.HTMLInputTypeAttribute | undefined;
}

export function InputField({ onChange, label, type, name }: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <p className="text-xs">{label}</p>
      <input
        name={name}
        type={type}
        onChange={onChange}
        className="text-black"
      />
    </div>
  );
}

interface ButtonProps {
  onClick: () => void;
  children: any;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}

export function AppBar() {
  return (
    <div className="h-[10vh] p-2 flex items-center justify-between">
      <p className="text-2xl font-semibold">Solana Examples</p>
      <WalletMultiButton />
    </div>
  );
}

export function Sidenav() {
  return (
    <div className="flex flex-col p-2 gap-2 min-h-screen bg-slate-900 w-[10vw]">
      <Link href={"/umi/create-mint"}>UMI Create Mint</Link>
      <Link href={"/umi/create-fungible-token"}>UMI Create Fungible Token</Link>
      <Link href={"/umi/upload-irys"}>UMI Upload Irys</Link>
      <Link href={"/umi/upload-json-irys"}>UMI Upload Json Irys</Link>
      <Link href={"/umi/create-nft"}>UMI Create NFT</Link>
      <Link href={"/umi/create-candy-machine"}>UMI Create Candy Machine</Link>
      <Link href={"/umi/create-merkle-tree"}>UMI Create Merkle Tree</Link>{" "}
      <Link href={"/umi/create-cnft"}>UMI cNFT</Link>
    </div>
  );
}
