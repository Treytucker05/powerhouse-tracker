import Papa from "papaparse";

export async function loadCsv(path: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(path, {
            header: true,
            download: true,
            complete: (results) => resolve(results.data as any[]),
            error: (err) => reject(err),
        });
    });
}
