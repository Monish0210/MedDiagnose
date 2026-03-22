"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FuzzyDetail } from "@/lib/types"

type FuzzyPanelProps = {
	fuzzyDetails: FuzzyDetail[]
	clusterScores: Record<string, number>
}

export function FuzzyPanel({ fuzzyDetails, clusterScores }: FuzzyPanelProps) {
	if (fuzzyDetails.length === 0) {
		return null
	}

	const clusterData = Object.entries(clusterScores)
		.map(([cluster, score]) => ({
			cluster,
			score,
		}))
		.sort((a, b) => b.score - a.score)

	const getSeverityClasses = (dominantSet: FuzzyDetail["dominant_set"]) => {
		if (dominantSet === "HIGH") {
			return "bg-red-500 text-white"
		}
		if (dominantSet === "MEDIUM") {
			return "bg-amber-500 text-white"
		}
		return "bg-blue-500 text-white"
	}

	const getClusterWidthClass = (score: number) => {
		if (score <= 0.01) return "w-0"
		if (score >= 0.9) return "w-[90%]"
		if (score >= 0.8) return "w-[80%]"
		if (score >= 0.7) return "w-[70%]"
		if (score >= 0.6) return "w-[60%]"
		if (score >= 0.5) return "w-[50%]"
		if (score >= 0.4) return "w-[40%]"
		if (score >= 0.3) return "w-[30%]"
		if (score >= 0.2) return "w-[20%]"
		if (score >= 0.1) return "w-[10%]"
		return "w-[5%]"
	}

	const sigmaVerified = fuzzyDetails.every((detail) => Math.abs(detail.mf_sum - 1) < 0.01)

	return (
		<Card className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
			<CardHeader className="mb-4 flex-row items-center justify-between space-y-0 p-0">
				<div className="flex items-center gap-2">
					<CardTitle className="text-base font-semibold text-zinc-900">Fuzzy Analysis</CardTitle>
				</div>
				<span className={`rounded-full px-2 py-0.5 text-xs ${sigmaVerified ? "border border-emerald-100 bg-emerald-50 text-emerald-600" : "border border-amber-100 bg-amber-50 text-amber-600"}`}>
					Σ=1.000 {sigmaVerified ? "verified" : "check"}
				</span>
			</CardHeader>
			<CardContent className="space-y-3 p-0">
				<div>
					{fuzzyDetails.map((detail) => (
						<div key={detail.symptom} className="flex items-center gap-3 border-b border-zinc-100 py-2 last:border-0">
							<span title={detail.symptom} className="w-35 shrink-0 truncate text-sm font-medium text-zinc-800">{detail.symptom}</span>
							<span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${getSeverityClasses(detail.dominant_set)}`}>
								{detail.dominant_set === "MEDIUM" ? "MED" : detail.dominant_set}
							</span>
							<span className="ml-auto shrink-0 whitespace-nowrap text-xs font-mono text-zinc-400">
								L:{detail.mu_low.toFixed(3)} M:{detail.mu_medium.toFixed(3)} H:{detail.mu_high.toFixed(3)}
							</span>
							<span className="ml-1 shrink-0 text-xs font-mono text-emerald-500">Σ={detail.mf_sum.toFixed(3)}</span>
						</div>
					))}
				</div>

				<div>
					<p className="mb-3 mt-4 text-sm font-medium text-zinc-600">Cluster Activation</p>
					<div className="space-y-1">
						{clusterData.map((item) => (
							<div key={item.cluster} className="flex items-center gap-2.5 py-1">
								<p className="min-w-40 shrink-0 text-sm text-zinc-600">{item.cluster}</p>
								<div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
									<div className={`h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out ${getClusterWidthClass(item.score)}`} />
								</div>
								<p className="w-8 text-right text-sm tabular-nums text-zinc-500">{item.score.toFixed(2)}</p>
							</div>
						))}
					</div>
				</div>

				<div>
					<p className="mb-3 mt-4 text-sm font-medium text-zinc-600">Evidence Scores</p>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="bg-zinc-50 text-xs font-medium uppercase tracking-wide text-zinc-400">
								<th className="px-2 py-2 text-left">Symptom</th>
								<th className="px-2 py-2 text-right">P(S|D)</th>
								<th className="px-2 py-2 text-right">ic</th>
								<th className="px-2 py-2 text-right">ev</th>
							</tr>
						</thead>
						<tbody>
							{fuzzyDetails.map((detail) => (
								<tr key={`${detail.symptom}-evidence`} className="border-b border-zinc-50 text-sm last:border-0">
									<td title={detail.symptom} className="max-w-50 overflow-hidden text-ellipsis whitespace-nowrap px-2 py-2 text-sm font-medium text-zinc-800">{detail.symptom}</td>
									<td className="px-2 py-2 text-right text-sm tabular-nums text-zinc-500">{(detail.p_laplace ?? 0).toFixed(3)}</td>
									<td className="px-2 py-2 text-right text-sm tabular-nums text-zinc-500">{detail.input_centroid.toFixed(3)}</td>
									<td className="px-2 py-2 text-right text-sm tabular-nums font-semibold text-zinc-700">{(detail.evidence_score ?? 0).toFixed(3)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	)
}

