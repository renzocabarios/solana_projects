import { Navbar, CustomerCard } from "@/components";

export default function Home() {
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
