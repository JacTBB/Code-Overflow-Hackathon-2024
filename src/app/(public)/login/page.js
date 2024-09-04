"use client";

import BottomGradient from "@/components/bottom_gradient";
import GoogleIcon from "@/components/google_icon";
import LoginForm from "@/components/loginForm";
import { pb } from "@/lib/db";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    console.log(formData);

    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(formData.email, formData.password);
      console.log("User logged in:", authData);

      toast("Logged in!");
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  const googleAuth = async () => {
    await pb
      .collection("users")
      .authWithOAuth2({ provider: "google" })
      .then((response) => {
        toast("OAuth login successful!");
        router.push("/dashboard");
      })
      .catch((e) => {
        console.log("Error logging in with provider  == ", e);
      });
  };

  return (
    <main className="p-16">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Financial App
        </h2>
        <p className="text-neutral-700 text-md font-bold underline max-w-sm mt-2 dark:text-neutral-300">
          Login
        </p>
        <Link href="/register">
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Don&apos;t have an account? Register{" "}
            <span className="font-bold">here</span>
          </p>
        </Link>
        {error && <p className="mb-4 text-red-500">{error}</p>}{" "}
        {/* Error message display */}
        <LoginForm onSubmit={handleSubmit}>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

          <div className="flex flex-col space-y-4">
            <button
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              onClick={googleAuth}
            >
              <GoogleIcon />
              <BottomGradient />
            </button>
          </div>
        </LoginForm>
      </div>
    </main>
  );
}
