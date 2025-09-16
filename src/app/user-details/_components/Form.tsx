"use client";

import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { zodResolver } from "@/hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Combobox } from "../../../components/ui/combobox";
import { Input } from "../../../components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "../../../components/ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  department: z.string().nonempty("Please select a department"),
  year: z
    .string()
    .max(1, "Year must be a single digit")
    .nonempty("Please select a year"),
  semester: z
    .string()
    .max(1, "Semester must be a single digit")
    .nonempty("Please select a semester"),
  phoneNumber: z.string().length(10, "Phone number must be 10 digits"),
  enrollmentNo: z.string().nonempty("Enrollment number is required"),
});

const DetailForm = ({ userDetails }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: userDetails?.department || "",
      enrollmentNo: userDetails?.enrollmentNo || "",
      phoneNumber: userDetails?.phoneNumber || "",
      semester: userDetails?.semester || "",
      year: userDetails?.year || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting values:", values);
    try {
      setIsLoading(true);
      const response = await axios.post("/api/user-detail", values);
      console.log("API response:", response.data);
      setIsLoading(false);
      toast({
        title: response.data.message,
        description: "You can start participation now",
        duration: 1500,
      });
      router.push("/events");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong!",
        variant: "destructive",
        description: "Please try again later.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-gradient-to-br from-slate-900/30 to-green-900/20 rounded-lg border border-green-900/70 max-w-2xl mx-auto w-full shadow-lg"
        aria-labelledby="detail-form-title"
      >
        <h2
          id="detail-form-title"
          className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6"
        >
          Update Your Details
        </h2>

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="ml-1 text-sm font-medium text-gray-300">
                Select the year you are in
              </FormLabel>
              <FormControl>
                <Combobox
                  options={["1", "2", "3", "4"]}
                  {...field}
                  label="Select Year"
                  className="w-full"
                  aria-label="Select your academic year"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="ml-1 text-sm font-medium text-gray-300">
                Select your department
              </FormLabel>
              <FormControl>
                <Combobox
                  options={[
                    "CO",
                    "IT",
                    "MH",
                    "CL",
                    "AIDS",
                    "IC",
                    "CH",
                    "EL",
                    "EC",
                    "MCA",
                    "TT",
                    "IMCA",
                  ]}
                  {...field}
                  label="Select Department"
                  className="w-full"
                  aria-label="Select your department"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="ml-1 text-sm font-medium text-gray-300">
                Select your semester
              </FormLabel>
              <FormControl>
                <Combobox
                  options={["1", "2", "3", "4", "5", "6", "7", "8"]}
                  {...field}
                  label="Select Semester"
                  className="w-full"
                  aria-label="Select your semester"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-300">
                Mobile Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="999999999"
                  inputMode="numeric"
                  {...field}
                  className="max-w-md w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  aria-label="Enter your 10-digit mobile number"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enrollmentNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-300">
                Enrollment No.
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ET22BTCO133"
                  {...field}
                  className="max-w-md w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  aria-label="Enter your enrollment or roll number"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400">
                If you don&apos;t have one, enter your roll number
              </FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full flex gap-2 items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white disabled:bg-gray-500"
          disabled={isLoading}
          aria-label="Submit your details"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default DetailForm;
