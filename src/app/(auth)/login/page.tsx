"use client";
import { createClient } from "@/utils/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AuthenticationPage() {
  const router = useRouter();
  const supabase = createClient();

  supabase.auth.onAuthStateChange(async (event) => {
    console.log(event);
    if (event != "INITIAL_SESSION" && event != "SIGNED_OUT") {
      router.push("/");
    }
  });

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
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="grid gap-6">
              <Auth
                supabaseClient={supabase}
                providers={[]}
                view="sign_in"
                redirectTo="/"
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: "pink",
                        brandAccent: "orange",
                      },
                    },
                  },
                }}
                localization={{
                  variables: {
                    sign_up: {
                      link_text: "",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
