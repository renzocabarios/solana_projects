"use client";
import { Button } from "@/components/ui/button";
import WriteButton from "@/components/write-button";
import useSendTransaction from "@/hooks/useSendTransaction";
import {
  VAULT_PROGRAM_ID,
  getVaultAddress,
  initializeVault,
} from "@/lib/programs/vault_program";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export default function CreateVaultButton() {
  const { handleSendTransaction } = useSendTransaction();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const onSubmit = async () => {
    if (wallet) {
      const [vault_pkey, vault_bump] = getVaultAddress(
        wallet.publicKey,
        VAULT_PROGRAM_ID
      );

      alert(vault_pkey);
      handleSendTransaction(
        await (
          await initializeVault(
            { connection, wallet },
            { vaultAccount: vault_pkey, vaultAuthority: wallet?.publicKey }
          )
        ).transaction()
      );
    }
  };

  return (
    <WriteButton>
      <Button onClick={onSubmit}>Create Vault</Button>
    </WriteButton>
  );
}
