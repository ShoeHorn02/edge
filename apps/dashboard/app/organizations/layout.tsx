import { redirect } from "next/navigation";
import { getSession } from "@workspace/auth";

export default async function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.completedOnboarding) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
