"use client";

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
import { pb } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useState } from "react";

export default function Rewards() {
  const [redeemCode, setRedeemCode] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      try {
        const user = await pb.collection("users").getOne(pb.authStore.model.id);
        const rewards = await pb.collection("rewards").getFullList();

        return {
          user: {
            email: user.email,
            points: user.points,
          },
          rewards: rewards,
        };
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    },
    staleTime: 60 * 1000,
  });

  async function redeem(reward) {
    console.log(reward);

    const updatedUser = await pb
      .collection("users")
      .getOne(pb.authStore.model.id);
    if (!updatedUser.points) updatedUser.points = 0;
    updatedUser.points -= reward.cost;
    await pb.collection("users").update(pb.authStore.model.id, updatedUser);

    setRedeemCode(Math.round(Math.random() * 10000000000000000000));
  }

  function closeRedeem() {
    setRedeemCode("");
  }

  return (
    <main className="p-16">
      {error ? (
        <LoadingError />
      ) : isLoading ? (
        <Loading />
      ) : (
        <div className="flex">
          <div className="min-w-[400px] mr-10">
            <h2 className="text-xl font-bold mb-5">Rewards</h2>
            {data.rewards.map((reward, index) => (
              <React.Fragment key={index}>
                <div className="flex my-5">
                  <div>
                    <p className="font-medium">{reward.name}</p>
                    <p className="font-sm text-gray-600">
                      Cost: {reward.cost} points
                    </p>
                  </div>
                  <div className="ml-auto">
                    {reward.cost < data.user.points ? (
                      <Button onClick={() => redeem(reward)}>Redeem</Button>
                    ) : (
                      <Button disabled>Redeem</Button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white">
            <div>
              <p className="text-xl font-bold">Your Points</p>
              <p>Email: {data.user.email}</p>
              <p>Points: {data.user.points.toString()}</p>
            </div>
            <div className="border-b border-b-gray-300 my-2"></div>
            <div>
              <p className="text-lg font-bold">How to earn points?</p>
              <p>- Complete lesson quizzes</p>
              <p>- Save at least $100 a month</p>
            </div>
          </div>

          <Dialog open={redeemCode != ""}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Your redemption code:</DialogTitle>
                <DialogDescription>
                  <p className="text-lg font-medium">{redeemCode}</p>
                  <p>Copy and use this code on the redemption website</p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="default" onClick={closeRedeem}>
                    Close
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
