"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import type { MetricsResponse } from "@/lib/types"

export function MetricsCompare() {
	const [metrics, setMetrics] = useState<MetricsResponse | null>(null)

	useEffect(() => {
		let mounted = true
		const load = async () => {
			const response = await fetch("/api/metrics")
			if (!response.ok) {
				return
			}
			const payload = (await response.json()) as MetricsResponse
			if (mounted) {
				setMetrics(payload)
			}
		}
		void load()
		return () => {
			mounted = false
		}
	}, [])

	if (!metrics) {
		return null
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Model Accuracy Comparison</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Progress value={Math.max(0, Math.min(metrics.fuzzy_top1, 100))} indicatorClassName="bg-green-600">
					<ProgressLabel>Fuzzy Top-1</ProgressLabel>
					<ProgressValue>{() => `${metrics.fuzzy_top1.toFixed(2)}%`}</ProgressValue>
				</Progress>
				<Progress value={Math.max(0, Math.min(metrics.binary_top1, 100))} indicatorClassName="bg-slate-500">
					<ProgressLabel>Binary Top-1</ProgressLabel>
					<ProgressValue>{() => `${metrics.binary_top1.toFixed(2)}%`}</ProgressValue>
				</Progress>
			</CardContent>
		</Card>
	)
}
