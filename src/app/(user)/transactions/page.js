"use client";

import Loading from "@/components/loading";
import LoadingError from "@/components/loadingError";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { pb } from "@/lib/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import TransactionCategories from "../transactionCategories/page";

export default function Transactions() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const transactionCategories = await pb
          .collection("transaction_categories", {
            filter: `user = "${pb.authStore.model.id}"`,
          })
          .getFullList();
        const transactions = await pb
          .collection("transactions", {
            filter: `user = "${pb.authStore.model.id}"`,
            sort: "date",
          })
          .getFullList();
        console.log(transactionCategories);
        console.log(transactions);

        return {
          transactions: transactions,
          transactionCategories: transactionCategories,
        };
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    },
    staleTime: 60 * 1000,
  });

  const formSchema = z.object({
    name: z.string().min(3).max(50),
    amount: z.number(),
    description: z.string().min(1).max(100),
    date: z.date(),
    type: z.string(),
    category: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  async function deleteTransaction(id) {
    // await pb.collection("transaction_categories").delete(id);
    // toast("Category deleted!");
    // queryClient.invalidateQueries({ queryKey: ["transactionCategories"] });
  }

  async function newTransaction(formData) {
    console.log(formData);

    await pb.collection("transactions").create({
      name: formData.name,
      description: formData.description,
      amount: formData.amount,
      category: formData.category,
      type: formData.type,
      date: formData.date,
      user: pb.authStore.model.id,
    });
    setFormOpen(false);

    toast("Transaction added!");
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  }

  return (
    <main className="p-16">
      {error ? (
        <LoadingError />
      ) : isLoading ? (
        <Loading />
      ) : (
        <div>
          <h1 className="text-3xl font-bold underline mb-5">Transactions</h1>
          <div className="mb-5">
            <Sheet open={formOpen} onOpenChange={setFormOpen}>
              <SheetTrigger asChild>
                <Button>Add new transaction</Button>
              </SheetTrigger>
              <SheetContent className="min-w-[200px]">
                <SheetHeader>
                  <SheetTitle>Add Transaction</SheetTitle>
                </SheetHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(newTransaction)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Chicken Rice..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Chicken Rice as food to survive..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <input
                              type="number"
                              placeholder="Enter amount"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                              onChange={(event) => {
                                const value = event.target.value;
                                if (typeof Number(field.value) === "number") {
                                  field.onChange(parseFloat(value));
                                } else {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value?.toString()}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  {Object.values(
                                    data.transactionCategories,
                                  ).map((category, index) => (
                                    <React.Fragment key={index}>
                                      <SelectItem value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    </React.Fragment>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value?.toString()}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="need">Need</SelectItem>
                                  <SelectItem value="want">Want</SelectItem>
                                  <SelectItem value="income">Income</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-black">
                            Transaction Date
                          </FormLabel>
                          <FormControl>
                            <DateTimePicker
                              hourCycle={12}
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Add transaction
                    </Button>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>

            <Button asChild>
              <Link href="/transactionCategories" className="ml-5">
                Edit Transaction Categories
              </Link>
            </Button>
          </div>
          <table>
            <tr className="min-w-[300px] pb-1 border-b border-b-gray-300">
              <th className="px-2">Name</th>
              <th className="px-2">Description</th>
              <th className="px-2">Amount</th>
              <th className="px-2">Category</th>
              <th className="px-2">Type</th>
              <th className="px-2">Date</th>
            </tr>
            {data.transactions.map((transaction, index) => (
              <React.Fragment key={index}>
                <tr className="min-w-[300px] pb-1 border-b border-b-gray-300">
                  <td className="px-3">{transaction.name}</td>
                  <td className="px-3">{transaction.description}</td>
                  <td className="px-3">${transaction.amount.toFixed(2)}</td>
                  <td className="px-3">
                    {
                      data.transactionCategories.find(
                        (c) => c.id == transaction.category,
                      ).name
                    }
                  </td>
                  <td className="px-3">{transaction.type}</td>
                  <td className="px-3">
                    {new Date(transaction.date).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  {/* <td className="pl-5 py-1">
                    <Button
                      variant="destructive"
                      onClick={() => deleteTransaction(transaction.id)}
                    >
                      Delete
                    </Button>
                  </td> */}
                </tr>
              </React.Fragment>
            ))}
          </table>
        </div>
      )}
    </main>
  );
}
