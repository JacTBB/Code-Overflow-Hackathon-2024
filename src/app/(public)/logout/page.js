"use client";

import { pb } from "@/lib/db";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Logout() {
  const router = useRouter();

  pb.authStore.clear();
  toast("Logged out successfully!");
  router.push("/login");

  return (
    <main className="p-16">
      <p>Logging out...</p>
    </main>
  );
}
