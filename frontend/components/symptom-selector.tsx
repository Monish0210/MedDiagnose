"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SymptomSelectorProps = {
	selectedSymptoms: string[]
	onChange: (s: string[]) => void
	onRunAnalysis?: () => void
	isRunning?: boolean
	runDisabled?: boolean
}

export function SymptomSelector({ selectedSymptoms, onChange, onRunAnalysis, isRunning = false, runDisabled = false }: SymptomSelectorProps) {
	const [allSymptoms, setAllSymptoms] = useState<string[]>([])
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		let mounted = true
		const fetchSymptoms = async () => {
			setLoading(true)
			try {
				const response = await fetch("/api/symptoms")
				if (!response.ok) {
					throw new Error("Failed to fetch symptoms")
				}
				const data = (await response.json()) as string[]
				if (mounted) {
					setAllSymptoms(data)
				}
			} catch {
				if (mounted) {
					setAllSymptoms([])
				}
			} finally {
				if (mounted) {
					setLoading(false)
				}
			}
		}

		void fetchSymptoms()
		return () => {
			mounted = false
		}
	}, [])

	const selectedSet = useMemo(() => new Set(selectedSymptoms), [selectedSymptoms])

	const toggleSymptom = (symptom: string) => {
		if (selectedSet.has(symptom)) {
			onChange(selectedSymptoms.filter((s) => s !== symptom))
			return
		}
		onChange([...selectedSymptoms, symptom])
	}

	const removeSymptom = (symptom: string) => {
		onChange(selectedSymptoms.filter((s) => s !== symptom))
	}

	return (
		<Card className="rounded-xl border border-zinc-200 border-t-2 border-t-indigo-500 bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
			<CardHeader className="mb-3 flex-row items-center justify-between space-y-0 p-0">
				<div className="flex items-center gap-2">
					<span className="h-2 w-2 rounded-full bg-indigo-500" />
					<CardTitle className="text-base font-semibold text-zinc-900">Symptoms</CardTitle>
				</div>
				{selectedSymptoms.length > 0 ? (
					<span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-sm font-medium text-indigo-600">{selectedSymptoms.length} selected</span>
				) : null}
			</CardHeader>
			<CardContent className="space-y-3 p-0">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger
						className={cn(
							buttonVariants({ variant: "outline" }),
							"h-10 w-full justify-between rounded-lg border-zinc-200 bg-white text-sm text-zinc-400 hover:border-zinc-300 hover:bg-white"
						)}
					>
						<span className="flex items-center gap-2">
							<Search className="h-4 w-4 text-zinc-400" />
							<span>{loading ? "Loading symptoms..." : "Search symptoms..."}</span>
						</span>
						<ChevronsUpDown className="opacity-60" />
					</PopoverTrigger>
					<PopoverContent className="w-(--anchor-width) p-0">
						<Command>
							<CommandInput placeholder="Search symptoms..." />
							<CommandList>
								<CommandEmpty>No symptom found.</CommandEmpty>
								<CommandGroup heading="Symptoms">
									{allSymptoms.map((symptom) => {
										const selected = selectedSet.has(symptom)
										return (
											<CommandItem
												key={symptom}
												value={symptom}
												onSelect={() => toggleSymptom(symptom)}
												data-checked={selected}
											>
												<Check className={cn("mr-1", selected ? "opacity-100" : "opacity-0")} />
												<span>{symptom}</span>
											</CommandItem>
										)
									})}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>

				<div className="mt-3 flex flex-wrap gap-1.5">
					{selectedSymptoms.map((symptom) => (
						<Badge key={symptom} variant="outline" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100">
							<span>{symptom}</span>
							<Button
								variant="ghost"
								size="icon-xs"
								className="ml-0.5 size-4 rounded-full text-zinc-400 hover:text-zinc-700"
								onClick={() => removeSymptom(symptom)}
							>
								<X className="size-3" />
							</Button>
						</Badge>
					))}
				</div>

				{onRunAnalysis ? (
					<Button
						className={cn(
							"mt-4 h-10 w-full rounded-lg bg-linear-to-r from-zinc-900 to-zinc-800 text-sm font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-200 hover:from-zinc-800 hover:to-zinc-700",
							isRunning && "animate-pulse opacity-80"
						)}
						onClick={onRunAnalysis}
						disabled={runDisabled}
					>
						{isRunning ? <Loader2 className="animate-spin" /> : null}
						{isRunning ? "Analysing..." : "Run Analysis"}
					</Button>
				) : null}
			</CardContent>
		</Card>
	)
}

