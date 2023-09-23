import { uploadFile, uploadNFT, createNFT } from "./utils/index.js";

async function main() {
  const imageURI = await uploadFile("./assets/image.png");
  const metadataURI = await uploadNFT(imageURI);
  const address = await createNFT(metadataURI);
  console.log("NFT Address: ", address);
}

main();
