from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


CLUSTER_ORDER = [
	"fever_syndrome",
	"pain_syndrome",
	"digestive_syndrome",
	"skin_syndrome",
	"respiratory_syndrome",
	"fatigue_syndrome",
	"neurological_syndrome",
	"inflammatory_syndrome",
]


CLUSTER_KEYWORDS: dict[str, tuple[str, ...]] = {
	"fever_syndrome": (
		"fever",
		"temperature",
		"chill",
		"sweat",
		"shiver",
	),
	"pain_syndrome": (
		"pain",
		"ache",
		"stiff",
		"cramp",
		"tender",
	),
	"digestive_syndrome": (
		"stomach",
		"abdomen",
		"nausea",
		"bowel",
		"appetite",
		"vomit",
		"diarr",
		"constipation",
		"indigestion",
		"acidity",
	),
	"skin_syndrome": (
		"skin",
		"rash",
		"itch",
		"sore",
		"blister",
		"nail",
		"pimple",
		"patch",
		"eruption",
	),
	"respiratory_syndrome": (
		"cough",
		"breath",
		"phlegm",
		"sputum",
		"sneez",
		"nose",
		"throat",
		"chest",
		"sinus",
		"wheeze",
	),
	"fatigue_syndrome": (
		"fatigue",
		"weight",
		"balance",
		"concentration",
		"letharg",
		"weak",
		"tired",
		"exhaust",
	),
	"neurological_syndrome": (
		"dizz",
		"vision",
		"speech",
		"anxiety",
		"mood",
		"sensorium",
		"memory",
		"seiz",
		"numb",
		"tingl",
		"depress",
	),
}


def assign_cluster(symptom_name: str) -> str:
	text = symptom_name.lower()

	for cluster_name in CLUSTER_ORDER[:-1]:
		keywords = CLUSTER_KEYWORDS.get(cluster_name, ())
		if any(keyword in text for keyword in keywords):
			return cluster_name

	return "inflammatory_syndrome"


def build_cluster_config(dataset_path: Path) -> dict[str, list[str]]:
	df = pd.read_csv(dataset_path)
	symptom_cols = [col for col in df.columns if col.startswith("Symptom_")]

	# Strip outer whitespace only; preserve internal spacing.
	df[symptom_cols] = df[symptom_cols].fillna("").astype(str).apply(lambda col: col.str.strip())

	all_symptoms = sorted(
		{
			value
			for value in df[symptom_cols].to_numpy().ravel().tolist()
			if value != ""
		}
	)

	cluster_map: dict[str, list[str]] = {cluster: [] for cluster in CLUSTER_ORDER}

	for symptom in all_symptoms:
		cluster_name = assign_cluster(symptom)
		cluster_map[cluster_name].append(symptom)

	all_assigned = [symptom for cluster in CLUSTER_ORDER for symptom in cluster_map[cluster]]

	# Verification requirements.
	assert len(all_assigned) == len(all_symptoms)
	assert len(set(all_assigned)) == len(all_assigned)

	for cluster in CLUSTER_ORDER:
		cluster_map[cluster] = sorted(cluster_map[cluster])

	return cluster_map


def main() -> None:
	backend_dir = Path(__file__).resolve().parent
	data_dir = backend_dir / "data"

	dataset_path = data_dir / "dataset.csv"
	output_path = data_dir / "cluster_config.json"

	cluster_map = build_cluster_config(dataset_path)
	all_assigned = [symptom for cluster in CLUSTER_ORDER for symptom in cluster_map[cluster]]
	duplicate_count = len(all_assigned) - len(set(all_assigned))

	print("Cluster sizes:")
	for cluster_name in CLUSTER_ORDER:
		print(f"- {cluster_name}: {len(cluster_map[cluster_name])}")

	print(f"total_assigned={len(all_assigned)}")
	print(f"duplicates_detected={duplicate_count}")

	with output_path.open("w", encoding="utf-8") as file:
		json.dump(cluster_map, file, indent=2)

	print(f"\nWrote cluster config to: {output_path}")


if __name__ == "__main__":
	main()

