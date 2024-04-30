import Link from "next/link";

const UMI = [
  { title: "Create Mint", href: "/umi/create-mint" },
  { title: "Create Fungible Token", href: "/umi/create-fungible-token" },
  { title: "Upload Irys", href: "/umi/upload-irys" },
  { title: "Upload Json Irys", href: "/umi/upload-json-irys" },
  { title: "UMI Create NFT", href: "/umi/create-nft" },
  { title: "Create Candy Machine", href: "/umi/create-candy-machine" },
  { title: "Create Merkle Tree", href: "/umi/create-merkle-tree" },
  { title: "Fetch Merkle Tree", href: "/umi/fetch-merkle-tree" },
  { title: "Create cNFT", href: "/umi/create-cnft" },
];

export function Sidenav() {
  return (
    <div className="flex flex-col p-2 gap-2 min-h-screen bg-secondary w-[10vw]">
      <p className="font-medium">UMI</p>

      {UMI.map((link) => {
        return (
          <Link href={link.href} key={link.title}>
            <p className="text-sm">{link.title}</p>
          </Link>
        );
      })}
    </div>
  );
}
