import { loadCsv } from "@/lib/loadCsv";
import type { ConditioningRow, JumpsThrowsRow } from "@/types/step3";

export async function loadConditioningRows(): Promise<ConditioningRow[]> {
    return loadCsv<ConditioningRow>(`${import.meta.env.BASE_URL}methodology/extraction/conditioning.csv`);
}

export async function loadJumpsThrowsRows(): Promise<JumpsThrowsRow[]> {
    return loadCsv<JumpsThrowsRow>(`${import.meta.env.BASE_URL}methodology/extraction/jumps_throws.csv`);
}
