import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession, auth } from "@workspace/auth";

export default async function OnboardingPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.completedOnboarding) {
    redirect("/organizations");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Welcome to Onboarding</h1>
      <p className="mt-2 text-muted-foreground">
        Please complete your profile to continue.
      </p>
      {/* Add onboarding form here */}
      <form
        action={async () => {
          "use server";
          await auth.api.updateUser({
            headers: await headers(),
            body: {
              completedOnboarding: true,
            },
          });
          redirect("/organizations");
        }}
      >
        <button
          type="submit"
          className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
        >
          Complete Onboarding
        </button>
      </form>
    </div>
  );
}
