"use client"

import { login } from "@/utils/chapter/access"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AuthenticationPage() {
  const router = useRouter()

  const [message, setMessage] = useState("")
  const [showLogin, setShowLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [messageType, setMessageType] = useState("")

  const onLogin = async (formData: FormData) => {
    try {
      const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      }
      await login(data.email, data.password)
      return router.push("/")
    } catch (error: any) {
      setMessageType("error")
      setMessage("Login failed! Please check your credentials and try again.")
      setLoading(false)
    }
  }

  const onResetPassword = async (formData: FormData) => {
    try {
      const data = {
        email: formData.get("email") as string,
      }
      const currentDomain = window.location.host
      setMessage("Password reset link sent to email!")
      setMessageType("reset")
    } catch (error: any) {
      setMessage(error.toString())
    }
    setLoading(false)
  }
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
      <div className="md:container relative h-dvh bg-zinx-100 flex flex-col justify-between py-5">
        <div className="flex items-center justify-center">
          <Image
            src="/images/logos/logo-icon.svg"
            width={44}
            height={44}
            alt="Nectar"
          />
        </div>
        <div className="flex flex-1 h-full items-center justify-center">
          {showLogin ? (
            <div className="flex">
              <div className="grid grid-cols-3 gap-x-24 border-border border rounded-3xl p-6">
                <div className="col-span-3">
                  {" "}
                  <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                      <div className="grid gap-6">
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
                                setLoading(true)
                              }}
                              formAction={onLogin}
                            >
                              {loading ? "Signing in..." : "Sign in"}
                            </Button>
                            <Button
                              onClick={() => {
                                setShowLogin(false)
                                setMessage("")
                              }}
                              variant="link"
                            >
                              Reset password
                            </Button>
                          </div>
                        </form>
                        {message && (
                          <p
                            className={`flex flex-wrap border rounded-lg py-3 text-sm px-5 text-center ${
                              messageType === "error"
                                ? "border-border bg-card"
                                : messageType === "reset"
                                ? "border-border bg-card"
                                : "border-border bg-card"
                            }`}
                          >
                            {" "}
                            {message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:p-8">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-medium tracking-tight">
                    Reset Password
                  </h1>
                </div>
                <div className="grid gap-6">
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
                          setLoading(true)
                        }}
                        formAction={onResetPassword}
                      >
                        {loading
                          ? "Sending email..."
                          : "Send reset link to email"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowLogin(true)
                          setMessage("")
                        }}
                        variant="link"
                      >
                        Sign in
                      </Button>
                    </div>
                  </form>

                  {message && (
                    <p
                      className={`flex border  rounded-lg p-3 text-xs ${
                        messageType === "error"
                          ? "border-rose-200 bg-rose-50"
                          : messageType === "reset"
                          ? "border-indigo-200 bg-indigo-100"
                          : "border-zinc-200 bg-white"
                      }`}
                    >
                      {" "}
                      {message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center justify-center">
          <p className="text-sm font-medium">
            @ 2024 Nectar Labs UG. All rights reserved.
          </p>
        </div>
      </div>
    </>
  )
}
