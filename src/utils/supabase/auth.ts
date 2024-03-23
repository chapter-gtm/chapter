"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    throw Error((error as Error).message);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) throw Error((error as Error).message);

  revalidatePath("/", "layout");
  redirect("/");
}

export async function sendResetPasswordLink(email: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `http://localhost:3000/reset-password`,
  });
  if (error) throw Error((error as Error).message);
}

export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  console.log("Listening for state change...");
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == "PASSWORD_RECOVERY") {
      console.log("Password recovery");
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      console.log(data);

      if (!data || error) throw Error((error as Error).message);
    }
  });
}
