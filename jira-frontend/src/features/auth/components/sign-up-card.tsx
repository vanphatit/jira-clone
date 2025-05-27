import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"

import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { DottedSeparator } from "@/components/dotted-separator";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { signUpSchema } from "../schemas";
import { useRegister } from "../api/use-register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SignUpCard = () => {
  const { mutate } = useRegister()
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repassword: ""
    }
  })

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/github`;
  };  

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    mutate(values, {
      onSuccess: (_, variables) => {
        toast.success("Account created! Please check your email.");
        router.push(`/verify?email=${variables.email}`); // ✅ Add this
      },
      onError: (err) => toast.error(err.message),
    });
  }

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              name="repassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <Button disabled={false} size="lg" className="w-full">
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          onClick={handleGoogleLogin}
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Sign up with Google
        </Button>
        <Button
          onClick={handleGithubLogin}
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Sign up with GitHub
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account?
          <Link href="/sign-in">
            <span className="text-blue-700">&nbsp;Login</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
