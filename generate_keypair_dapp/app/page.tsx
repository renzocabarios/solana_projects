"use client";
import { useState } from "react";

export default function Home() {
  const [publicKey, setpublicKey] = useState("");
  const [privateKey, setprivateKey] = useState("");

  const generate = async () => {
    const response = await fetch(`http://localhost:3000/api`);
    const parsed = await response.json();
    setpublicKey(parsed.publicKey);
    setprivateKey(parsed.privateKey);
  };

  return (
    <main className="h-screen flex flex-col gap-5 justify-center items-center">
      <button onClick={generate}>Generate</button>
      <p className="text-3xl">{publicKey}</p>
      <p className="text-3xl">{privateKey}</p>
    </main>
  );
}
