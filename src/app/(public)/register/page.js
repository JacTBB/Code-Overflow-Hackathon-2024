"use client";

import RegisterForm from "@/components/registerForm";
import BottomGradient from "@/components/bottom_gradient";
import GoogleIcon from "@/components/google_icon";
import HomeIcon from "@/components/home_icon";
import { pb } from "@/lib/db";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    console.log(formData);

    const data = {
      username: formData.username,
      name: formData.name,
      email: formData.email,
      emailVisibility: true,
      password: formData.password,
      passwordConfirm: formData.password,
    };

    try {
      const record = await pb.collection("users").create(data);
      console.log("User registered:", record);
      await pb.collection("users").requestVerification(formData.email);

      toast("Registration successful! Check your email for verification.");
      router.push("/login");
    } catch (err) {
      console.log(err);
      setError(err.message);
      console.error("Registration error:", err);
    }
  };

  const googleAuth = async () => {
    await pb
      .collection("users")
      .authWithOAuth2({ provider: "google" })
      .then((response) => {
        // console.log(response.meta);
        pb.collection("users")
          .update(response.record.id, {
            username: response.meta.name,
            name: response.meta.name,
            avatarUrl: response.meta.avatarUrl,
          })
          .then((res) => {
            console.log("Successfully updated profie", res);
            toast("OAuth registration successful!");
            router.push("/login");
          })
          .catch((e) => {
            console.log("Error updating profile  == ", e);
          });
        setLoading(false);
      })
      .catch((e) => {
        console.log("Error registering with provider  == ", e);
      });
  };

  return (
    <main className="p-16">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Financial App
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Register
        </p>
        {error && <p className="mb-4 text-red-500">{error}</p>}{" "}
        {/* Error message display */}
        <RegisterForm onSubmit={handleSubmit}>
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
            <Link
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              href="/"
            >
              <HomeIcon />
              <BottomGradient />
            </Link>
          </div>
        </RegisterForm>
      </div>
    </main>
  );
}