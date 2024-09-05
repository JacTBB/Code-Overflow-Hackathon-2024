"use client";

import Loading from "@/components/loading";
import LoadingError from "@/components/loadingError";
import { Button } from "@/components/ui/button";
import { pb } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { useEffect, useState } from "react";

export default function Lesson({ params }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(pb.authStore.isValid);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["lesson", params.id],
    queryFn: async () => {
      try {
        const lesson = await pb.collection("lessons").getOne(params.id);
        console.log(lesson);
        const quiz = (
          await pb.collection("quizzes").getList(1, 1, {
            filter: `lesson = "${lesson.id}"`,
          })
        ).items[0];
        console.log(quiz);
        const quizScores = await pb.collection("quiz_scores").getList(1, 10, {
          filter: `quiz = "${quiz.id}"`,
          sort: "-score",
        });
        console.log(quizScores);

        return {
          lesson: lesson,
          quizScores: quizScores.items,
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
        <div>
          <h1 className="text-3xl font-bold underline mb-5">
            {data.lesson.name}
          </h1>

          <div className="flex flex-wrap my-5">
            <p>{data.lesson.content}</p>
          </div>

          {loggedIn ? (
            <Button asChild>
              <Link href={`/lesson/quiz/${data.lesson.id}`}>Start Quiz</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/login`}>Login to Start Quiz</Link>
            </Button>
          )}

          <h3 className="text-xl mt-5 mb-3 font-medium">Top 10 Leaderboard</h3>
          <table>
            <tr>
              <th>No.</th>
              <th className="px-5">Score</th>
              <th>Username</th>
            </tr>
            {data.quizScores.map((quizScores, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{index + 1}.</td>
                  <td className="px-5">{quizScores.score}</td>
                  <td>{quizScores.username}</td>
                </tr>
              </React.Fragment>
            ))}
          </table>
        </div>
      )}
    </main>
  );
}
