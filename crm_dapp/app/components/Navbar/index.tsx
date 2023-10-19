"use client";
import React from "react";
import style from "./style.module.css";
import Image from "next/image";
import { Button } from "@/components";
import { useWeb3Store } from "@/states";
function Navbar() {
  const { setWallet } = useWeb3Store() as any;
  return (
    <>
      <div className={style.toolbar}>
        <h5 className="font-bold">CRM DAPP</h5>
        <div className={style.links_container}>
          <Button
            onClick={() => {
              setWallet();
            }}
          >
            Connect Wallet
          </Button>
        </div>
      </div>
      <div className={style.divider}></div>
    </>
  );
}

export default Navbar;
