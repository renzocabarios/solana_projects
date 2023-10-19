import React from "react";
import style from "./style.module.css";

function CustomerCard({ first_name, last_name, email, deleted }: any) {
  return (
    <>
      <div className={`${style.container} ${deleted ? style.deleted : ""}`}>
        <h4 className="text-white-300">
          {first_name} {last_name}
        </h4>

        <h5>{email}</h5>
        {/* <p>{deleted}</p> */}
      </div>
    </>
  );
}

export default CustomerCard;
