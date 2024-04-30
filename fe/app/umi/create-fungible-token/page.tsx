import React from "react";
import CreateFTForm from "./(components)/create-ft-form";

function UMICreateFungibleToken() {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl font-bold">Create Fungible Token</p>
      <CreateFTForm />
    </div>
  );
}

export default UMICreateFungibleToken;
