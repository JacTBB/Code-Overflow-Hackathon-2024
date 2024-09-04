"use client"

import { pb } from "@/lib/db";
import { useState } from "react";
import { useEffect } from "react";
import HomeIcon from "@/components/home_icon";
import Link from "next/link";
import BottomGradient from "@/components/bottom_gradient";

export default function ViewUsers(){
  const [error, setError] = useState("");
  const [records, setRecords] = useState([])

  // you can also fetch all records at once via getFullList
  useEffect(()=> {
    const getRecords = async() => {
      try{
        const records = await pb
          .collection("users")
          .getFullList({sort: '-created', requestKey: null});
        const result = await pb.collection('users').listAuthMethods({requestKey: null});
        console.log(result);
        setRecords(records);
        console.log(pb.authStore.isValid);
        console.log(pb.authStore.token);
        console.log(pb.authStore.model);
        if (!pb.authStore.isValid){
          throw new Error;
        }
      } catch (err){
        console.log(err);
        setError(err.message);
      }
    }

    getRecords();
  }, []);
  return(

    <main className="p-16">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
        {error && <p className="my-2 pb-4">You do not have the permission to view this resource</p>}{" "}

        {records && (
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-4">
            View users
          </h2>
        )}

        {records && records.map((record) => (
          <div key={record.id}>
            <p>Username: {record.username}</p>
            <p>Name: {record.name}</p>
            <p>Email: {record.email}</p>
            <p>User ID: {record.id}</p>
            {/* ... other record fields */}
          </div>
        ))}
        <div className="flex flex-col space-y-4">
        
          <Link href="/login">
            <p className="text-neutral-600 text-sm max-w-sm dark:text-neutral-300">
              Already have an account? Login{" "}
              <span className="font-bold">here</span>
            </p>
          </Link>

          <Link href="/register">
            <p className="text-neutral-600 text-sm max-w-sm dark:text-neutral-300">
              Don&apos;t have an account? Register{" "}
              <span className="font-bold">here</span>
            </p>
          </Link>

          <Link
            className="relative group/btn flex space-x-2 items-center justify-start px-4 w-80 text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
            href="/"
          >
            <HomeIcon />
            <BottomGradient />
          </Link>
        </div>
      </div>
    </main>
  )
}