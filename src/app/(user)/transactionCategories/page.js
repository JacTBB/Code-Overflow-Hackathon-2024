"use client";

import Loading from "@/components/loading";
import LoadingError from "@/components/loadingError";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function TransactionCategories() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["transactionCategories"],
    queryFn: async () => {
      try {
        const transactionCategories = await pb
          .collection("transaction_categories", {
            filter: `user = "${pb.authStore.model.id}"`,
          })
          .getFullList();

        return {
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
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  async function deleteCategory(id) {
    await pb.collection("transaction_categories").delete(id);

    toast("Category deleted!");
    queryClient.invalidateQueries({ queryKey: ["transactionCategories"] });
  }

  async function newCategory(formData) {
    console.log(formData);

    await pb.collection("transaction_categories").create({
      name: formData.name,
      user: pb.authStore.model.id,
    });
    setFormOpen(false);

    toast("Category created!");
    queryClient.invalidateQueries({ queryKey: ["transactionCategories"] });
  }

  return (
    <main className="p-16">
      {error ? (
        <LoadingError />
      ) : isLoading ? (
        <Loading />
      ) : (
        <div>
          <h1 className="text-3xl font-bold underline mb-5">
            Transaction Categories
          </h1>
          <div className="mb-5">
            <Sheet open={formOpen} onOpenChange={setFormOpen}>
              <SheetTrigger asChild>
                <Button>Add new category</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add Category</SheetTitle>
                </SheetHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(newCategory)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Food..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Add category
                    </Button>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
          </div>
          <table>
            {data.transactionCategories.map((transactionCategory, index) => (
              <React.Fragment key={index}>
                <tr className="py-3">
                  <td>
                    <p className="text-lg min-w-[300px] border-b border-b-gray-300">
                      {transactionCategory.name}
                    </p>
                  </td>
                  <td className="pl-5">
                    <Button
                      variant="destructive"
                      onClick={() => deleteCategory(transactionCategory.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </table>
        </div>
      )}
    </main>
  );
}
