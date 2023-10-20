"use client"
import { useEffect, useState } from "react";


export default function useWeb3() {
    const [connected, setConnected] = useState<boolean>(false);
    const [wallet, setWallet] = useState<string | null>(null);

    const connectWallet = async () => {
        const { solana } = window as any;
        const account = await solana.connect()
        setWallet(account.publicKey.toString())
        setConnected(true)
    }

    const disconnectWallet = async () => {
        setConnected(false)
        setWallet(null)
    }

    useEffect(() => {
        const start = async () => {
            const { solana } = window as any;
            const account = await solana.connect()
            setWallet(account.publicKey.toString())
            setConnected(true)
        }
        start()
    }, []);

    return { connectWallet, connected, wallet, disconnectWallet }
}