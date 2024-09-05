"use client"

import { pb } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/loading";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      try {
        const user = await pb.collection("users").getOne(pb.authStore.model.id);

        return {
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
          },
        };
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    },
    staleTime: 60 * 1000,
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {error ? (
        <div>  
          <h2 className="mb-3 text-2xl font-semibold">Sign up today for Unnamed Financial App</h2>
          <div className="m-24 relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            <Image
              className="relative auto"
              src="/NYP Logo.png"
              alt="Logo"
              width={180}
              height={180}
              priority
            />
          </div>

          <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-4xl lg:grid-cols-3 gap-2 lg:text-left">
            <Link href="/login">
              <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                <h2 className="mb-3 text-2xl font-semibold">
              Login{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                  </span>
                </h2>
                {/* <p className="m-0 max-w-[30ch] text-sm opacity-50">WIP</p> */}
              </div>
            </Link>

            <Link href="/register">
              <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                <h2 className="mb-3 text-2xl font-semibold">
              Register{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                  </span>
                </h2>
                {/* <p className="m-0 max-w-[30ch] text-sm opacity-50">WIP</p> */}
              </div>
            </Link>

            <Link href="#">
              <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                <h2 className="mb-3 text-2xl font-semibold">
              About Us{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                  </span>
                </h2>
                <p className="m-0 max-w-[30ch] text-sm opacity-50">WIP</p>
              </div>
            </Link>
          </div>
        </div>
      ) : isLoading ? (
        <Loading />
      ) :(
        <div>
          <h2 className="mb-3 text-3xl font-semibold">Welcome back, {data.user.username}</h2>

          <div className="m-24 relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            <Image
              className="relative auto"
              src="/NYP Logo.png"
              alt="Logo"
              width={180}
              height={180}
              priority
            />
          </div>

          <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-4xl lg:grid-cols-3 gap-2 lg:text-left">
            <Link href="/login">
              <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                <h2 className="mb-3 text-2xl font-semibold">
              Login{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                  </span>
                </h2>
                {/* <p className="m-0 max-w-[30ch] text-sm opacity-50">WIP</p> */}
              </div>
            </Link>

            <Link href="/register">
              <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                <h2 className="mb-3 text-2xl font-semibold">
              Register{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                  </span>
                </h2>
                {/* <p className="m-0 max-w-[30ch] text-sm opacity-50">WIP</p> */}
              </div>
            </Link>

            <Link href="#">
              <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                <h2 className="mb-3 text-2xl font-semibold">
              About Us{" "}
                  <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                  </span>
                </h2>
                <p className="m-0 max-w-[30ch] text-sm opacity-50">WIP</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
