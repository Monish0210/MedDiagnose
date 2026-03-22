import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ChevronDown } from "lucide-react"

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

  return (
    <div data-theme="dark" className="min-h-screen bg-[#0d0d1a] text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0d0d1a]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <p className="text-sm font-semibold text-white">MedDiagnose</p>
          <div className="flex items-center">
            <Link href="/login" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Sign in
            </Link>
            <Link href="/signup" className="ml-4 rounded-md bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-zinc-100">
              Get started →
            </Link>
          </div>
        </div>
      </header>

      <section className="landing-hero relative min-h-screen overflow-hidden bg-[#0d0d1a]">
        <div className="hero-grid absolute inset-0 z-0" />
        <div className="hero-orb orb-1 absolute -left-25 -top-25 z-0 h-125 w-125 rounded-full" />
        <div className="hero-orb orb-2 absolute -bottom-20 -right-20 z-0 h-150 w-150 rounded-full" />
        <div className="hero-orb orb-3 absolute right-[10%] top-[30%] z-0 h-75 w-75 rounded-full" />

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-16 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <span>Soft Computing · Fuzzy-Bayesian Pipeline</span>
            </div>
            <h1 className="mx-auto mb-6 max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl">
              Symptom-Driven
              <br />
              Medical Diagnosis
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-zinc-400">
              Enter your symptoms. The system applies Fuzzy Set Theory and Bayesian Inference across 4,920 clinical records to rank 41 disease categories by posterior probability.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup" className="rounded-md bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-100">
                Start diagnosis
              </Link>
              <Link href="/login" className="rounded-md border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white">
                Sign in
              </Link>
            </div>
            <p className="mt-4 text-xs text-zinc-600">Educational use only · Not a substitute for medical advice</p>
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-xs text-zinc-600">
            <span>Scroll to learn more</span>
            <ChevronDown className="animate-bounce-down" size={16} />
          </div>
        </div>
      </section>

      <section className="border-y border-[#1e1e3a] bg-[#111127] py-10">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {[
            { value: "131", label: "symptoms" },
            { value: "41", label: "diseases" },
            { value: "4,920", label: "records" },
            { value: "5", label: "pipeline steps" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="shimmer-text text-3xl font-bold tabular-nums">{stat.value}</p>
              <p className="mt-1.5 text-xs uppercase tracking-widest text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-[#0a0a14] py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-indigo-400">THE PIPELINE</p>
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-white">How the system analyses symptoms</h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-sm text-zinc-500">
            A five-step mathematical pipeline combining fuzzy logic with probabilistic inference
          </p>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                tag: "Steps 1–2",
                title: "Fuzzification",
                body: "Severity weights 1–7 map to LOW, MEDIUM, and HIGH memberships via Triangular MFs. Partition of Unity guarantees all degrees sum to exactly 1.0.",
              },
              {
                step: "02",
                tag: "Steps 3–4",
                title: "Evidence Scoring",
                body: "Laplace-smoothed P(S|D) from 3,936 training records. evidence(S,D) = severity_score × P(S|D) couples the fuzzy and Bayesian systems at the symptom level.",
              },
              {
                step: "03",
                tag: "Step 5",
                title: "Bayesian Posterior",
                body: "Log-sum across all 41 diseases prevents underflow. Max-subtraction ensures numerical stability. Output: a calibrated probability distribution.",
              },
            ].map((item) => (
              <article key={item.step} className="cursor-default rounded-2xl border border-zinc-800 bg-zinc-900 p-7 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/80">
                <div className="mb-5 flex items-center justify-between">
                  <p className="font-mono text-xs text-zinc-600">{item.step}</p>
                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-400">{item.tag}</span>
                </div>
                <h3 className="mb-3 text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 bg-[#0d0d1a] py-10">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row">
            <div>
              <p className="text-sm font-semibold text-white">MedDiagnose</p>
              <p className="mt-1 text-xs text-zinc-600">Fuzzy-Bayesian Medical Diagnosis System</p>
              <p className="mt-0.5 text-xs text-zinc-700">Soft Computing Research Project</p>
            </div>
            <div className="flex gap-6">
              <Link href="/login" className="text-sm text-zinc-500 transition-colors hover:text-white">Sign in</Link>
              <Link href="/signup" className="text-sm text-zinc-500 transition-colors hover:text-white">Get started</Link>
            </div>
          </div>
          <p className="mt-8 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-700">
            © 2024 MedDiagnose · Educational use only · Not a substitute for professional medical advice
          </p>
        </div>
      </footer>
    </div>
  )
}
