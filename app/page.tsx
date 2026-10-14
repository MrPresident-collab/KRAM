import { redirect } from "next/navigation";

export default function Home() {
  // Keep the production root public, but make local development open the Ops workspace first.
  if (process.env.NODE_ENV === "development") {
    redirect("/fr/ops");
  }

  redirect("/fr");
}
