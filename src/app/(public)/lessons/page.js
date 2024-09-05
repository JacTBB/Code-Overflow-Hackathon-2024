"use client";

import Loading from "@/components/loading";
import LoadingError from "@/components/loadingError";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pb } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export default function Lessons() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      try {
        const lessons = await pb.collection("lessons").getFullList();

        return lessons;
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
          <h1 className="text-3xl font-bold underline mb-5">Lessons</h1>
          <div className="flex flex-wrap">
            {data.map((lesson, index) => (
              <React.Fragment key={index}>
                <Card className="min-w-[300px]">
                  <CardHeader>
                    <CardTitle>{lesson.name}</CardTitle>
                    <CardDescription className="min-h-[50px]">
                      {lesson.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`/lesson/${lesson.id}`}>View Lesson</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
