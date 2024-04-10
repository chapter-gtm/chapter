"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, sendResetPasswordLink } from "@/utils/supabase/auth";
import Image from "next/image";
import { useState } from "react";

export default function AuthenticationPage() {
  const [message, setMessage] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: FormData) => {
    try {
      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };
      await login(data.email, data.password);
    } catch (error: any) {
      setMessage(error.toString());
      setLoading(false);
    }
  };

  const handleResetPassword = async (formData: FormData) => {
    try {
      const data = {
        email: formData.get("email") as string,
      };
      await sendResetPasswordLink(data.email);
      setMessage("Password reset link sent to email!");
    } catch (error: any) {
      setMessage(error.toString());
    }
    setLoading(false);
  };
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        />
      </div>
      <div className="container relative hidden h-dvh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col justify-between bg-muted p-10 text-white lg:flex dark:border-r ">
          <div className="absolute inset-0 bg-slate-900" />
          <div className="relative z-20 flex items-center text-lg font-medium space-x-3">
            <Image
              src="/images/logos/logo-icon.svg"
              width={44}
              height={44}
              alt="Nectar"
              className="rounded-md"
            />
            <p className="text-white">Nectar</p>
          </div>

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg"></p>
              <footer className="text-sm">
                A modern qualitative research platform
              </footer>
            </blockquote>
          </div>
        </div>

        {showLogin ? (
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign in
                </h1>
              </div>
              <div className="grid gap-6">
                <p>{message}</p>
                <form>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label className="sr-only" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                      />
                    </div>
                    <Label className="sr-only" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Your Password"
                      required
                    />
                    <Button
                      onClick={() => {
                        setLoading(true);
                      }}
                      formAction={handleLogin}
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowLogin(false);
                        setMessage("");
                      }}
                      variant="link"
                    >
                      Reset password
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Reset Password
                </h1>
              </div>
              <div className="grid gap-6">
                <p>{message}</p>
                <form>
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label className="sr-only" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                      />
                    </div>
                    <Button
                      onClick={() => {
                        setLoading(true);
                      }}
                      formAction={handleResetPassword}
                    >
                      {loading
                        ? "Sending email..."
                        : "Send reset link to email"}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowLogin(true);
                        setMessage("");
                      }}
                      variant="link"
                    >
                      Sign in
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
