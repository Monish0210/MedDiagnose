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

export default function SignupPage() {
	const router = useRouter()

	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSignup = async () => {
		setError(null)

		if (password !== confirmPassword) {
			setError("Passwords do not match.")
			return
		}

		setIsLoading(true)

		try {
			const result = await authClient.signUp.email({
				name,
				email,
				password,
			})

			if (result.error) {
				setError(result.error.message ?? "Signup failed.")
				return
			}

			router.push("/dashboard")
		} catch {
			setError("Signup failed. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>Sign up to continue to your dashboard.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error ? (
						<Alert>
							<AlertTitle>Could not create account</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					) : null}

					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							value={name}
							onChange={(event) => setName(event.target.value)}
							disabled={isLoading}
							placeholder="John Doe"
						/>
					</div>

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

					<div className="space-y-2">
						<Label htmlFor="confirm-password">Confirm password</Label>
						<Input
							id="confirm-password"
							type="password"
							value={confirmPassword}
							onChange={(event) => setConfirmPassword(event.target.value)}
							disabled={isLoading}
						/>
					</div>

					<Button onClick={handleSignup} disabled={isLoading} className="w-full">
						{isLoading ? (
							<>
								<Loader2 className="animate-spin" />
								Creating account...
							</>
						) : (
							"Sign up"
						)}
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link className="text-primary hover:underline" href="/login">
							Login
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	)
}
