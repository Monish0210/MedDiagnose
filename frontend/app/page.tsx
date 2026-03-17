import { cookies } from "next/headers"
import { redirect } from "next/navigation"

function hasSessionCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const cookieNames = cookieStore.getAll().map((cookie) => cookie.name)

  return cookieNames.some(
    (name) =>
      name === "better-auth.session_token" ||
      name === "__Secure-better-auth.session_token" ||
      name === "better-auth-session_token" ||
      name === "__Secure-better-auth-session_token"
  )
}

export default async function Home() {
  const cookieStore = await cookies()

  if (hasSessionCookie(cookieStore)) {
    redirect("/dashboard")
  }

  redirect("/login")
}
