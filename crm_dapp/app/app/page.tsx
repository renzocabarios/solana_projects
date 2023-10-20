"use client"
import { Navbar, CustomerCard } from "@/components";
import { getAllCustomers } from "@/fetch";
import { useSolana } from "@/hooks";
import { useEffect } from "react";

export default function Home() {
  const { program } = useSolana()

  useEffect(() => {

    const start = async () => {
      const data = await getAllCustomers(program)
      alert(data)
    }
    start();
  }, [])

  return (
    <main>
      <Navbar />
      <div className="p-5 flex flex-col gap-5">
        <CustomerCard
          first_name={"asd"}
          last_name={"asd"}
          email={"asd"}
          deleted={true}
        ></CustomerCard>{" "}
        <CustomerCard
          first_name={"asd"}
          last_name={"asd"}
          email={"asd"}
          deleted={true}
        ></CustomerCard>{" "}
        <CustomerCard
          first_name={"asd"}
          last_name={"asd"}
          email={"asd"}
          deleted={true}
        ></CustomerCard>
      </div>
    </main>
  );
}
