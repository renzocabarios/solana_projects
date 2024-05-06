import EnrollButton from "@/views/enroll-button";
import Enrollees from "@/views/enrollees";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-3">
          <Enrollees />
        </div>
        <div className="col-span-9">
          <div className="flex flex-col gap-5 rounded-xl border p-5">
            <p className="text-xl font-medium">Solana Bootcamp - #10</p>
            <p>
              ​The Solana Developers Bootcamp provides practical application and
              approach in learning Solana blockchain in just 2 weeks! ​If you
              are interested in building decentralized applications (dApps) on
              the Solana blockchain, join our FREE Solana Developers Bootcamp
              and unlock your potential as a Certified Solana Developer in just
              2 weeks! ​In this intensive bootcamp, you will learn important
              things you need to know about Solana blockchain development, from
              the basics to advanced concepts. Our comprehensive curriculum is
              designed to provide you with practical skills and hands-on
              experience in building dApps on Solana.
            </p>

            <p>
              ​Intensive 2-week program ​Practical application-focused
              curriculum ​Familiarize with Solana blockchain development ​Build
              real-world decentralized applications (dApps) ​Learn from industry
              experienced instructors ​Access to a supportive learning community
              ​Networking opportunities with fellow developers ​Free of charge
              ​Whether you are a beginner in blockchain development or have some
              experience, this bootcamp is suitable for anyone looking to
              advance their skills and leverage the power of Solana. Don't miss
              this opportunity to learn and kickstart your career as a Solana
              developer.
            </p>

            <div className="flex items-center justify-end">
              <EnrollButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
