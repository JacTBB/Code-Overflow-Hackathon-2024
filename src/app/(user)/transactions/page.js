"use client";

import Loading from "@/components/loading";
import LoadingError from "@/components/loadingError";
import { pb } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Transactions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const user = await pb.collection("users").getOne(pb.authStore.model.id);

        return {
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            points: user.points,
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
    <main className="p-16">
      {error ? (
        <LoadingError />
      ) : isLoading ? (
        <Loading />
      ) : (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
          <div>
            <p className="text-lg font-bold">Profile</p>
            <p>User ID: {data.user.id}</p>
            <p>Username: {data.user.username}</p>
            <p>Name: {data.user.name}</p>
            <p>Email: {data.user.email}</p>
            <p>Points: {data.user.points.toString()}</p>
          </div>
          <Link
            href="/transactionCategories"
            className="hover:underline font-medium"
          >
            Manage Transaction Categories
          </Link>
        </div>
      )}
    </main>
  );
}
