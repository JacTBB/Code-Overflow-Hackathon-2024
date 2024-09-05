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
import Chart from "chart.js/auto";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

        const getMonthName = (date) => {
          return new Date(date).toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          });
        };

        const sortedTransactions = transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );

        const groupedTransactions = sortedTransactions.reduce(
          (acc, transaction) => {
            const monthName = getMonthName(transaction.date);
            if (!acc[monthName]) {
              acc[monthName] = {
                transactions: [],
                count: 0,
                totalAmount: 0,
              };
            }
            acc[monthName].transactions.push(transaction);
            acc[monthName].count += 1;
            acc[monthName].totalAmount += transaction.amount;
            return acc;
          },
          {},
        );

        return {
          transactions: transactions,
          transactionCategories: transactionCategories,
          groupedTransactions: groupedTransactions,
        };
      } catch (err) {
        console.log(err);
        throw new Error(err.message);
      }
    },
    staleTime: 60 * 1000,
  });

  const currentMonth = new Date().toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Filtering transactions for the current month
  const thisMonthTransactions = data?.transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }) === currentMonth && transaction.amount < 0 // Only include negative transactions here
    );
  });

  // Grouping transactions by category for this month
  const categoryTotals = thisMonthTransactions?.reduce((acc, transaction) => {
    const category = data.transactionCategories.find(
      (cat) => cat.id === transaction.category,
    )?.name;
    if (category) {
      acc[category] = (acc[category] || 0) + transaction.amount; // Accumulate negative amounts
    }
    return acc;
  }, {});

  // Prepare data for the Pie chart
  const pieChartData = {
    labels: categoryTotals ? Object.keys(categoryTotals) : [],
    datasets: [
      {
        label: "Transaction Amounts",
        data: categoryTotals ? Object.values(categoryTotals) : [],
        backgroundColor: [
          "#FF6384", // Example colors
          "#36A2EB",
          "#FFCE56",
          "#FFB6C1",
          "#6A5ACD",
        ],
      },
    ],
  };

  const aggregateFinances = (transactions) => {
    const monthlyData = {};

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const monthYear = transactionDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expenses: 0 };
      }

      if (transaction.type === "income") {
        monthlyData[monthYear].income += transaction.amount;
      } else {
        monthlyData[monthYear].expenses -= transaction.amount;
      }
    });

    // Create arrays for the chart, and reverse them for display
    const labels = Object.keys(monthlyData).reverse(); // Reverse the keys for the correct order
    const incomeData = labels.map((month) => monthlyData[month].income);
    const expensesData = labels.map((month) => monthlyData[month].expenses);

    return { labels, incomeData, expensesData };
  };

  // Use the aggregate function to get data for the chart
  const { labels, incomeData, expensesData } = aggregateFinances(
    data?.transactions || [],
  );

  const lineChartData = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Expenses",
        data: expensesData,
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

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

          <div className="flex">
            <Card className="max-w-[400px] m-8">
              <CardHeader>
                <CardTitle>This Month&apos;s Expenditure by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-[300px] max-h-[400px] mx-auto">
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="max-w-[400px] m-8">
              <CardHeader>
                <CardTitle>Income and Expenses Over the Months</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-[300px] max-h-[400px] mx-auto">
                  <Line
                    data={lineChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false, // Allow manual control over the chart size
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

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
            <tr className="min-w-[300px] border-b border-b-gray-300">
              <th className="px-2">Name</th>
              <th className="px-2">Description</th>
              <th className="px-2">Amount</th>
              <th className="px-2">Category</th>
              <th className="px-2">Type</th>
              <th className="px-2">Date</th>
            </tr>
            {Object.entries(data.groupedTransactions).map(
              ([month, { transactions, count, totalAmount }]) => (
                <React.Fragment key={month}>
                  <tr>
                    <td
                      colSpan="6"
                      className="pt-5 text-xl text-center border-b border-gray-300"
                    >
                      <span className="font-bold">{month}</span> - {count}{" "}
                      Transactions, Total: ${totalAmount.toFixed(2)}
                    </td>
                  </tr>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="min-w-[300px] pb-1 border-b border-b-gray-300"
                    >
                      <td className="px-3">{transaction.name}</td>
                      <td className="px-3">{transaction.description}</td>
                      <td className="px-3 text-right">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-3">
                        {
                          data.transactionCategories.find(
                            (c) => c.id === transaction.category,
                          )?.name
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
                    </tr>
                  ))}
                </React.Fragment>
              ),
            )}
          </table>
        </div>
      )}
    </main>
  );
}
