import { auth } from "@/lib/auth";
import ThoughtsList from "@/components/ThoughtsList";
import GitHubSignInButton from "@/components/GitHubSignInButton";

export const revalidate = 60;

export default async function ThoughtsPage() {
  const session = await auth();

  if (!session || !session.accessToken) {
    return <GitHubSignInButton />;
  }

  return <ThoughtsList />;
}
