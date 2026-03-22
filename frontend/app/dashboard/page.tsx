"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { toast } from "sonner"

import { DiseaseInfoCard } from "@/components/disease-info-card"
import { SymptomSelector } from "@/components/symptom-selector"
import { FuzzyPanel } from "@/components/fuzzy-panel"
import { ResultsPanel } from "@/components/results-panel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { DiagnosisResponse } from "@/lib/types"

const elevatedCardClass =
	"rounded-xl border border-zinc-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]"

export default function DashboardPage() {
	const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
	const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResponse | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [leftInfoOpen, setLeftInfoOpen] = useState(false)
	const [rightInfoOpen, setRightInfoOpen] = useState(false)

	const runDiagnosis = async () => {
		setIsLoading(true)
		setError(null)
		try {
			const response = await fetch("/api/diagnose", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ symptoms: selectedSymptoms }),
			})

			const payload = (await response.json()) as DiagnosisResponse | { detail?: string; error?: string }
			if (!response.ok) {
				throw new Error(payload && "detail" in payload ? payload.detail || "Diagnosis failed" : "Diagnosis failed")
			}
			setDiagnosisResult(payload as DiagnosisResponse)
			toast.success("Analysis complete", {
				description: `Top prediction: ${(payload as DiagnosisResponse).top5[0]?.disease ?? "N/A"}`,
			})
		} catch (err) {
			setDiagnosisResult(null)
			setError(err instanceof Error ? err.message : "Unexpected error")
			toast.error("Backend unreachable — check port 8000", {
				description: err instanceof Error ? err.message : "Unexpected error",
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen w-full bg-zinc-100 pb-10 [background:linear-gradient(135deg,#f4f4f5_0%,#fafafa_100%)]">
			{isLoading ? <div className="fixed left-0 right-0 top-14 z-50 h-0.5 animate-shimmer bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-size-[200%_100%]" /> : null}
			<div className="w-full px-6 pt-5">
				{error ? (
					<Alert className="mb-5">
						<AlertTitle>Diagnosis Failed</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				) : null}

				<div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
					<div className="lg:col-span-2 flex flex-col gap-4">
					<SymptomSelector
						selectedSymptoms={selectedSymptoms}
						onChange={setSelectedSymptoms}
						onRunAnalysis={runDiagnosis}
						isRunning={isLoading}
						runDisabled={selectedSymptoms.length === 0 || isLoading}
					/>

					{isLoading ? (
						<Card className={`${elevatedCardClass} p-5`}>
							<CardContent className="space-y-3 p-0">
								<Skeleton className="h-4 w-1/3" />
								<Skeleton className="h-28 w-full" />
							</CardContent>
						</Card>
					) : diagnosisResult ? (
						<>
							<div className={`${elevatedCardClass} md:hidden px-5 py-3`}>
								<Accordion>
									<AccordionItem value="fuzzy" className="border-none">
										<AccordionTrigger className="py-1 text-sm font-semibold text-zinc-900 no-underline hover:no-underline dark:text-(--text-1)">
											Fuzzy Analysis
										</AccordionTrigger>
										<AccordionContent className="pt-3 pb-0">
											<FuzzyPanel
												fuzzyDetails={diagnosisResult.fuzzy_details ?? []}
												clusterScores={diagnosisResult.cluster_scores ?? {}}
											/>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</div>

							<div className="hidden md:block">
								<FuzzyPanel
									fuzzyDetails={diagnosisResult.fuzzy_details ?? []}
									clusterScores={diagnosisResult.cluster_scores ?? {}}
								/>
							</div>

							<Card className={`${elevatedCardClass} p-5`}>
								<Collapsible open={leftInfoOpen} onOpenChange={setLeftInfoOpen}>
									<CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between py-1 text-base font-semibold text-zinc-900">
										<span>About this diagnosis</span>
										<ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${leftInfoOpen ? "rotate-180" : ""}`} />
									</CollapsibleTrigger>
									<CollapsibleContent className="mt-3">
										<DiseaseInfoCard
											disease={diagnosisResult.top5[0]?.disease ?? ""}
											probability={diagnosisResult.top5[0]?.probability ?? 0}
											description={diagnosisResult.top5[0]?.description ?? "No description available."}
											precautions={diagnosisResult.top5[0]?.precautions ?? []}
										/>
									</CollapsibleContent>
								</Collapsible>
							</Card>
						</>
					) : null}
					</div>

					<div className="lg:col-span-3 flex flex-col gap-4">
					{isLoading ? (
						<Card className={`${elevatedCardClass} p-5`}>
							<CardContent className="space-y-3 p-0">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-36 w-full" />
							</CardContent>
						</Card>
					) : (
						<ResultsPanel results={diagnosisResult?.all_results ?? []} topResult={diagnosisResult?.top5?.[0]} />
					)}

					{diagnosisResult?.top5?.[0] ? (
						<Card className={`${elevatedCardClass} p-5`}>
							<Collapsible open={rightInfoOpen} onOpenChange={setRightInfoOpen}>
								<CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between py-1 text-base font-semibold text-zinc-900">
									<span>About this diagnosis</span>
									<ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${rightInfoOpen ? "rotate-180" : ""}`} />
								</CollapsibleTrigger>
								<CollapsibleContent className="mt-3">
									<DiseaseInfoCard
										disease={diagnosisResult.top5[0].disease}
										probability={diagnosisResult.top5[0].probability}
										description={diagnosisResult.top5[0].description}
										precautions={diagnosisResult.top5[0].precautions}
									/>
								</CollapsibleContent>
							</Collapsible>
						</Card>
					) : null}
					</div>
				</div>
			</div>
		</div>
	)
}
