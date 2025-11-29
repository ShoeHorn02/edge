import { headers } from "next/headers";

export async function getRedirectAfterSignIn(): Promise<string> {
  const headersList = await headers();
  const callbackUrl = headersList.get("callbackUrl");
  
  if (callbackUrl) {
    return callbackUrl;
  }

  return "/organizations";
}
