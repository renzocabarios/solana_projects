
import { useEffect, useState } from "react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { IProgram, CrmDapp } from "@/interfaces";
import { PublicKey } from "@solana/web3.js";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { IDL } from "@/config";

const CONNECTION: Connection = new Connection(
    clusterApiUrl("devnet"),
    "processed"
);

const PROGRAM: PublicKey = new PublicKey(
    "En6BofD5Pdmv3anMUKuL7zhbaYd7urCvkeqFa11Z9SFd"
);

const useSolana = () => {
    const [connection, setConnection] = useState<any>(CONNECTION);
    const [programId, setProgramId] = useState<any>(PROGRAM);
    const [program, setProgram] = useState<any>(null);
    const [provider, setProvider] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [solanaWindow, setSolanaWindow] = useState<any>(null);

    const getProviderInstance = (solana: any): AnchorProvider => {
        return new AnchorProvider(CONNECTION, solana, {
            commitment: "processed",
        });
    }

    const getProgramInstance = (provider: AnchorProvider): IProgram => {
        return new Program<CrmDapp>(IDL, PROGRAM, provider);
    }

    const connectWallet = async () => {
        const response = await solanaWindow.connect();
        setWallet(response.publicKey.toString())
    }

    useEffect(() => {
        const { solana } = window as any
        setSolanaWindow(solana)
        setProvider(getProviderInstance(solana));
        setProgram(getProgramInstance(solana));
    }, []);

    return { connection, setConnection, programId, setProgramId, program, setProgram, provider, setProvider, wallet, setWallet, connectWallet };
};

export default useSolana; 