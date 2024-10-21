import { Uploader } from "@irys/upload";
import { Solana } from "@irys/upload-solana";
import "dotenv/config"

const getIrysUploader = async () => {
	const irysUploader = await Uploader(Solana).withWallet(
		process.env.PRIVATE_KEY ?? ""
	).withRpc(process.env.RPC_URL ?? "").devnet();
	return irysUploader;
};

const fundAccount = async () => {
	const irysUploader = await getIrysUploader();
	try {
		const fundTx = await irysUploader.fund(irysUploader.utils.toAtomic(0.05));
		console.log(`Successfully funded ${irysUploader.utils.fromAtomic(fundTx.quantity)} ${irysUploader.token}`);
	} catch (e) {
		console.log("Error when funding ", e);
	}
};

const uploadFolder = async () => {
	const irysUploader = await getIrysUploader();

	const folderToUpload = "./images/"; // Path to folder
	try {
		const receipt = await irysUploader.uploadFolder("./" + folderToUpload, {
			indexFile: "", // Optional index file (file the user will load when accessing the manifest)
			batchSize: 50, // Number of items to upload at once
			keepDeleted: false, // whether to keep now deleted items from previous uploads
		}); // Returns the manifest ID

		console.log(`Files uploaded. Manifest ID ${receipt?.id}`);
	} catch (e) {
		console.log("Error when uploading ", e);
	}
};

(async () => {

	await getIrysUploader();
	await fundAccount();
	await uploadFolder();

})()
