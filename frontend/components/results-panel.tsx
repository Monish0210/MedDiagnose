"use client"

import { useMemo, useState } from "react"
import { Activity } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DiseaseDetail } from "@/components/disease-detail"
import type { DiseaseResult } from "@/lib/types"
import { cn } from "@/lib/utils"

type ResultsPanelProps = {
	results: DiseaseResult[]
	topResult?: DiseaseResult
}

export function ResultsPanel({ results, topResult }: ResultsPanelProps) {
	const [selectedDisease, setSelectedDisease] = useState<DiseaseResult | null>(null)
	const [sheetOpen, setSheetOpen] = useState(false)

	const top5 = useMemo(() => results.slice(0, 5), [results])
	const totalProbability = useMemo(
		() => results.reduce((sum, row) => sum + (Number.isFinite(row.probability) ? row.probability : 0), 0),
		[results]
	)

	const getConfidence = (p: number) => {
		if (p > 40) {
			return { label: "High confidence", className: "border-emerald-200 bg-emerald-50 text-emerald-700" }
		}
		if (p >= 20) {
			return { label: "Moderate confidence", className: "border-amber-200 bg-amber-50 text-amber-700" }
		}
		return { label: "Low confidence", className: "border-zinc-200 bg-zinc-100 text-zinc-500" }
	}

	const getBarWidthClass = (probability: number) => {
		if (probability >= 90) return "w-[90%]"
		if (probability >= 80) return "w-[80%]"
		if (probability >= 70) return "w-[70%]"
		if (probability >= 60) return "w-[60%]"
		if (probability >= 50) return "w-[50%]"
		if (probability >= 40) return "w-[40%]"
		if (probability >= 30) return "w-[30%]"
		if (probability >= 20) return "w-[20%]"
		if (probability >= 10) return "w-[10%]"
		return "w-[5%]"
	}

	const openDisease = (result: DiseaseResult) => {
		setSelectedDisease(result)
		setSheetOpen(true)
	}

	if (results.length === 0) {
		return (
			<Card className="rounded-xl border border-zinc-200 border-t-2 border-t-zinc-900 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
				<CardHeader className="p-0">
					<CardTitle className="text-base font-semibold text-zinc-900">Results</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<Activity className="mb-4 h-12 w-12 text-zinc-200" />
						<p className="text-sm font-medium text-zinc-400">No analysis yet</p>
						<p className="mt-1 text-sm text-zinc-500">Select symptoms and run analysis</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	const primary = top5[0]
	const secondary = top5.slice(1)

	return (
		<>
			<Card className="rounded-xl border border-zinc-200 border-t-2 border-t-zinc-900 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
				<CardHeader className="mb-4 flex-row items-center gap-2 space-y-0 p-0">
					<div className="flex items-center gap-2">
						<CardTitle className="text-base font-semibold text-zinc-900">Results</CardTitle>
						<span className="text-sm text-zinc-500">41 diseases ranked</span>
					</div>
					<span className="ml-auto text-xs text-zinc-300">Σ {totalProbability.toFixed(0)}%</span>
				</CardHeader>
				<CardContent className="space-y-3 p-0">
					{primary ? (
						<div className="mb-4 rounded-xl border border-zinc-200 bg-linear-to-br from-zinc-50 to-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
							<div className="flex items-start justify-between gap-2">
								<p className="text-xl font-semibold text-zinc-900">{primary.disease}</p>
								<p className="text-2xl font-bold tabular-nums text-zinc-900">{primary.probability.toFixed(2)}%</p>
							</div>
							<div className="mb-3 mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
								<div className={`h-full rounded-full bg-linear-to-r from-zinc-700 to-zinc-900 transition-all duration-700 ease-out ${getBarWidthClass(primary.probability)}`} />
							</div>
							<div className="flex items-center justify-between">
								<p className={cn("rounded-full border px-2.5 py-1 text-sm font-medium", getConfidence(primary.probability).className)}>{getConfidence(primary.probability).label}</p>
								<button type="button" className="cursor-pointer text-sm text-zinc-500 transition-colors hover:text-zinc-900" onClick={() => openDisease(primary)}>
									View details →
								</button>
							</div>
						</div>
					) : null}

					<div className="rounded-lg border border-zinc-100 bg-white divide-y divide-zinc-50">
						{secondary.map((item, index) => (
							<div key={`${item.disease}-${index + 1}`} className="flex items-center gap-3 px-4 py-3">
								<span className="w-5 shrink-0 font-mono text-xs tabular-nums text-zinc-300">{index + 2}</span>
								<p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-zinc-800">{item.disease}</p>
								<div className="h-1.5 w-20 shrink-0 overflow-hidden rounded-full bg-zinc-100">
									<div className={`h-full rounded-full bg-zinc-400 ${getBarWidthClass(item.probability)}`} />
								</div>
								<p className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-zinc-700">{item.probability.toFixed(1)}%</p>
								<button type="button" className="shrink-0 cursor-pointer text-sm text-zinc-400 transition-colors hover:text-indigo-600" onClick={() => openDisease(item)}>
									Details
								</button>
							</div>
						))}
					</div>
					<p className="mt-3 border-t border-zinc-100 pt-3 text-center text-xs text-zinc-400">
						Educational only · Consult a qualified doctor
					</p>
				</CardContent>
			</Card>

			<DiseaseDetail open={sheetOpen} onOpenChange={setSheetOpen} result={selectedDisease} />
		</>
	)
}

