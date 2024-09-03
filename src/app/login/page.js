"use client";

import LoginForm from "@/components/loginForm";
import { pb } from "@/lib/db";
import { IconBrandGoogle } from "@tabler/icons-react";
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
      router.push("/");
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
        router.push("/");
      })
      .catch((e) => {
        console.log("Error logging in with provider  == ", e);
      });
  };

  return (
    <main className="p-16">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to Aceternity
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login
        </p>
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
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </LoginForm>
      </div>
    </main>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
