"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
	const router = useRouter()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleLogin = async () => {
		setError(null)
		setIsLoading(true)

		try {
			const result = await authClient.signIn.email({
				email,
				password,
			})

			if (result.error) {
				setError(result.error.message ?? "Login failed.")
				return
			}

			router.push("/dashboard")
		} catch {
			setError("Login failed. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Welcome back</CardTitle>
					<CardDescription>Login to continue to your dashboard.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error ? (
						<Alert>
							<AlertTitle>Could not login</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					) : null}

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							disabled={isLoading}
							placeholder="john@example.com"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							disabled={isLoading}
						/>
					</div>

					<Button onClick={handleLogin} disabled={isLoading} className="w-full">
						{isLoading ? (
							<>
								<Loader2 className="animate-spin" />
								Logging in...
							</>
						) : (
							"Login"
						)}
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						No account yet?{" "}
						<Link className="text-primary hover:underline" href="/signup">
							Sign up
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
