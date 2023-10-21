import React from "react";
import style from "./style.module.css";
import { ConnectButton } from "@/components";
function Navbar() {
  return (
    <>
      <div className={style.toolbar}>
        <h5 className="font-bold">Connect Wallet</h5>
        <div className={style.links_container}>
          <ConnectButton />
        </div>
      </div>
      <div className={style.divider}></div>
    </>
  );
}

export default Navbar;
