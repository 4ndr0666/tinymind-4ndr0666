import { auth } from "@/lib/auth";
import EditorComponent from "@/components/Editor";
import GitHubSignInButton from "@/components/GitHubSignInButton";

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const session = await auth();

  const defaultType =
    resolvedParams.type === "blog"
      ? "blog"
      : resolvedParams.type === "about"
      ? "about"
      : "thought";

  if (!session) {
    return <GitHubSignInButton />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <EditorComponent defaultType={defaultType} />
    </div>
  );
}
