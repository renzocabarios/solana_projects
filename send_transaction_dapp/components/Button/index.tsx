import React from "react";
import style from "./style.module.css";

function Button({ onClick, type, children, outlined, light }: any) {
  return (
    <>
      <button
        className={style.button}
        onClick={onClick}
        type={type ?? "button"}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
