"use client";

import BottomGradient from "@/components/bottom_gradient";
import Loading from "@/components/loading";
import LoadingError from "@/components/loadingError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogRedirect";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { pb } from "@/lib/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Quiz({ params }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [completed, setCompleted] = useState(false);
  const [quizPoints, setQuizPoints] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["quiz", params.id],
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

  const handleSubmit = async (formData) => {
    var points = 0;
    var correct = 0;

    for (var i in data.quiz.questions) {
      const question = data.quiz.questions[i];
      if (question.correct == formData[i]) {
        points += question.points;
        correct++;
      }
    }

    pb.collection("quiz_scores").create({
      quiz: data.quiz.id,
      user: pb.authStore.model.id,
      score: points,
      username: pb.authStore.model.username,
    });

    if (correct == data.quiz.questions.length) {
      const updatedUser = await pb
        .collection("users")
        .getOne(pb.authStore.model.id);
      if (!updatedUser.points) updatedUser.points = 0;
      updatedUser.points += data.quiz.reward;
      await pb.collection("users").update(pb.authStore.model.id, updatedUser);
    }

    setCompleted(true);
    setQuizPoints(points);
    setQuizCorrect(correct);
  };

  const finishedRedirect = () => {
    queryClient.invalidateQueries({ queryKey: ["lesson", params.id] });
    router.push(`/lesson/${params.id}`);
  };

  const form = useForm();

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
            <p>Total Points: {data.quiz.points}</p>
          </div>

          <div className="flex flex-wrap my-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="my-4">
                {data.quiz.questions.map((question, index) => (
                  <React.Fragment key={index}>
                    <FormField
                      control={form.control}
                      name={`${index}`}
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>{question.question}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {Object.values(question.options).map(
                                (choice, index) => (
                                  <React.Fragment key={index}>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value={index + 1} />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {index + 1} - {choice}
                                      </FormLabel>
                                    </FormItem>
                                  </React.Fragment>
                                ),
                              )}
                            </RadioGroup>
                          </FormControl>
                          <FormDescription>
                            <p>Points: {question.points}</p>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </React.Fragment>
                ))}
                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  Submit &rarr;
                  <BottomGradient />
                </button>
              </form>
            </Form>
          </div>

          <Dialog open={completed}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>You have completed the quiz!</DialogTitle>
                <DialogDescription>
                  <p>
                    Correct Questions: {quizCorrect}/
                    {data.quiz.questions.length}
                  </p>
                  <p>
                    Total Points: {quizPoints}/{data.quiz.points}
                  </p>
                  {quizCorrect == data.quiz.questions.length && (
                    <p>
                      {data.quiz.reward} reward points has been given to you!
                    </p>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="default"
                    onClick={finishedRedirect}
                  >
                    View leaderboard
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </main>
  );
}
