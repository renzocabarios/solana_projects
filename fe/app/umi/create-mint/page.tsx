import React from "react";
import CreateMintForm from "./(components)/create-mint-form";

function UMICreateMint() {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl font-bold">Create Mint</p>
      <CreateMintForm />
    </div>
  );
}

export default UMICreateMint;
