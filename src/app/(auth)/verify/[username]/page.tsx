"use client";
import { useParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as React from "react";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast.success("Successfully verified!");
      router.replace(`/sign-in`);
    } catch (error) {
      console.log("Error in signing up user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data?.message ?? "Error is signing up user";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify your account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Verification code
                  </FieldLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    type="number"
                    id="code"
                    aria-invalid={fieldState.invalid}
                    placeholder="code"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button size="lg" type="submit">
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
}
