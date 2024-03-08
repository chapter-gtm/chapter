import { createClient as createServersideClient } from "@/utils/supabase/server";
import { createClient as createClientsideClient } from "@/utils/supabase/client";

export async function getUserAccessToken() {
  try {
    // Try serverside client
    const supabase = createServersideClient();
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  } catch (error) {
    if (error instanceof ReferenceError) {
      try {
        // Try clientside client
        const supabase = createServersideClient();
        const session = await supabase.auth.getSession();
        return session.data.session?.access_token;
      } catch (error) {
        throw error;
      }
    } else {
      throw error;
    }
  }
}
