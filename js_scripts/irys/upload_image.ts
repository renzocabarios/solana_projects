import { getIrysClient } from "./config";

const uploadFile = async () => {
  const irys = await getIrysClient();
  const fileToUpload = "./assets/image/nft_ticket.png";

  const tags = [{ name: "application-id", value: "MyNFTDrop" }];

  try {
    const receipt = await irys.uploadFile(fileToUpload, { tags: tags });
    console.log(`File uploaded ==> https://gateway.irys.xyz/${receipt.id}`);
  } catch (e) {
    console.log("Error uploading file ", e);
  }
};

uploadFile();
