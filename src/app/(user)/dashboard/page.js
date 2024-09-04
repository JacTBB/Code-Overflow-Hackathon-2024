"use client";

import { pb } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { OctagonX, RefreshCw } from "lucide-react";

export default function Dashboard() {
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
    <main className="p-16">
      {error ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <OctagonX className="size-20 text-destructive-foreground mb-3" />
          <span className=" text-3xl font-semibold">Something went wrong.</span>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <RefreshCw className="animate-spin size-20 text-destructive-foreground mb-3" />
          <span className=" text-3xl font-semibold">Loading...</span>
        </div>
      ) : (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
          <div>
            <p className="text-lg font-bold">Profile</p>
            <p>User ID: {data.user.id}</p>
            <p>Username: {data.user.username}</p>
            <p>Name: {data.user.name}</p>
            <p>Email: {data.user.email}</p>
          </div>
        </div>
      )}
    </main>
  );
}
