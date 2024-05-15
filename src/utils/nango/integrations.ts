import Nango from "@nangohq/frontend";

export async function addConnection(
  system: string,
  connectionId: string,
  hmacDigest: string,
) {
  let nango = new Nango({
    publicKey: process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY!,
  });
  const result = await nango.auth(system.toLowerCase(), connectionId, {
    hmac: hmacDigest,
  });
  return result;
}
