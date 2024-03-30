//app/api/test/route.js

import { SOLANA } from "@/config";
import {
  createGenericFileFromBrowserFile,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import { NextResponse } from "next/server";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";

function generateUMI() {
  const umi = createUmi(SOLANA.rpc).use(irysUploader()).use(mplToolbox());
  const serialized = base58.serialize(SOLANA.payer_private_key);
  const keypair = umi.eddsa.createKeypairFromSecretKey(serialized);
  umi.use(keypairIdentity(keypair));
  return umi;
}

// TODO: Add uplaod JSON costs
export async function POST(request: Request) {
  const umi = generateUMI();

  const formData = await request.formData();

  const imageFile = formData.get("image") as unknown as File | null;
  const metadata = formData.get("metadata") as unknown as string | null;

  if (imageFile === null) {
    return NextResponse.json({ msg: "Hello from server" });
  }

  if (metadata === null) {
    return NextResponse.json({ msg: "Hello from server" });
  }

  const parsedMetadata = JSON.parse(metadata);

  const file = await createGenericFileFromBrowserFile(imageFile);

  const [image] = await umi.uploader.upload([file]);

  const metadataJSON = await umi.uploader.uploadJson({
    ...parsedMetadata,
    image: image,
  });

  return NextResponse.json({
    uri: metadataJSON,
  });
}
