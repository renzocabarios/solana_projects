"use client";
import React from "react";
import useWeb3 from "@/hooks";
import style from "./style.module.css";

function AccountBalance({}: any) {
  const { balance } = useWeb3();

  return (
    <>
      <div className={style.container}>
        <h1 className="font-bold">Balance: {balance}</h1>
      </div>
    </>
  );
}
1;

export default AccountBalance;
