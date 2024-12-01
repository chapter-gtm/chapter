"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const handleUpdatePassword = async (formData: FormData) => {
    try {
      const record = {
        password: formData.get("password") as string,
        confirmedPassword: formData.get("password") as string,
      }

      if (record.password != record.confirmedPassword) {
        setMessage("Passwords don't match!")
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase.auth.updateUser({
        password: record.password,
      })
      if (!data || error) throw Error((error as Error).message)
      setMessage("Password updated successfully!")
      await sleep(1000)
      router.push("/")
    } catch (error: any) {
      setMessage(error.toString())
      setLoading(false)
    }
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
      <div className="container relative hidden h-dvh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col justify-between bg-muted p-10 text-white lg:flex dark:border-r border-border">
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

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            </div>
            <div className="grid gap-6">
              <p>{message}</p>
              <form>
                <div className="grid gap-2">
                  <Label className="sr-only" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your New Password"
                    required
                  />
                  <Label className="sr-only" htmlFor="password">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmedPassword"
                    name="confirmedPassword"
                    type="password"
                    placeholder="Confirm Your New Password"
                    required
                  />
                  <Button
                    onClick={() => {
                      setLoading(true)
                    }}
                    formAction={handleUpdatePassword}
                  >
                    {loading ? "Setting password..." : "Set new password"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
