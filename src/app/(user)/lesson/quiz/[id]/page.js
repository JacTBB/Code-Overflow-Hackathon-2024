"use client";

import Loading from "@/components/ui/loading";
import LoadingError from "@/components/ui/loadingError";
import { pb } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
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
        <div>
          <h1 className="text-3xl font-bold underline mb-5">
            {data.quiz.name}
          </h1>

          <div>
            <p>{data.quiz.description}</p>
            <p>Points: {data.quiz.points}</p>
          </div>

          <div className="flex flex-wrap my-5">
            {data.quiz.questions.map((question, index) => (
              <React.Fragment key={index}>
                <div>
                  <p>
                    Question {index + 1}: {question.question}
                  </p>
                  {Object.values(question.options).map((choice, index) => (
                    <React.Fragment key={index}>
                      <div>
                        <p>
                          &nbsp;&nbsp;{index + 1} - {choice}
                        </p>
                      </div>
                    </React.Fragment>
                  ))}
                  <p>Points: {question.points}</p>
                  <p>Correct: {question.correct}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
