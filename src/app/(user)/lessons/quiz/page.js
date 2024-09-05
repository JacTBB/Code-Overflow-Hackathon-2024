// // TODO: View quizzes interface
"use client";

import BottomGradient from "@/components/bottom_gradient";
import Loading from "@/components/loading";
import LoadingError from "@/components/loadingError";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { pb } from "@/lib/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// // TODO: View quizzes interface

// // TODO: View quizzes interface

export default function Quizzes() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["quiz"],
    queryFn: async () => {
      try {
        const quiz = await pb.collection("quizzes").getFullList();
        return {
          quiz: quiz,
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
        // Don't remove this code
        <></>
      )}
      {data && data.quiz ? (
        <>
          <p className="font-bold text-2xl pr-3 border-r border-r-gray-600 pb-5">
            View Users
          </p>
          {data.quiz.map((quiz, index) => (
            <h2 key={index}>
              Quiz ID: {quiz.id}
              <div> Quiz Name: {quiz.name}</div>
              <div>{quiz.description}</div>
              <Link
                href={`/lesson/quiz/${quiz.id}`}
                className="relative group/btn flex space-x-2 items-center justify-start px-4 w-40 my-8 text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              >
                Start Now
              </Link>
            </h2>
          ))}
        </>
      ) : (
        <div>No quizzes are available</div>
      )}
    </main>
  );
}
