import { auth } from "@acme/auth";

import { SignIn, SignOut } from "~/components/auth";

export async function AuthShowcase() {
  const session = await auth();
  console.log("test");
  console.log(session);
  if (!session) {
    return (
      <SignIn
        provider="cognito"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        Sign in with Cognito
      </SignIn>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session && <span>Logged in as {session?.user?.name}</span>}
      </p>

      <SignOut className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
        Sign out
      </SignOut>
    </div>
  );
}
