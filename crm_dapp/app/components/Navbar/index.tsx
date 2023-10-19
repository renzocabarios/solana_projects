"use client"
import React from "react";
import style from "./style.module.css";
import { ConnectWallet } from "@/components";
function Navbar() {
  return (
    <>
      <div className={style.toolbar}>
        <h5 className="font-bold">CRM DAPP</h5>
        <div className={style.links_container}>
          <ConnectWallet />
        </div>
      </div>
      <div className={style.divider}></div>
    </>
  );
}

export default Navbar;
