import { useState } from "react";
import { Button } from "../components/ui/button";

interface Log {
    _id: string;
    method: string;
    url: string;
    timestamp: string;
    statusCode?: number;
}

export default function DashboardPage() {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (start) {
                params.append("start", new Date(start).toISOString());
            }
            if (end) {
                params.append("end", new Date(end).toISOString());
            }

            const token = localStorage.getItem("token");
            const resp = await fetch(`/api/logs?${params.toString()}`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined
            });

            if (!resp.ok) {
                const body = await resp.json();
                throw new Error(body.message || "Failed to fetch logs");
            }

            const data = await resp.json();
            setLogs(data.data);
        } catch (err: any) {
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Logs Dashboard</h1>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-6">
                <div className="flex flex-col">
                    <label htmlFor="start" className="text-sm font-medium text-gray-600 mb-1">
                        Start Time
                    </label>
                    <input
                        id="start"
                        type="datetime-local"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="h-12 w-64 border border-gray-300 rounded px-3 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="end" className="text-sm font-medium text-gray-600 mb-1">
                        End Time
                    </label>
                    <input
                        id="end"
                        type="datetime-local"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="h-12 w-64 border border-gray-300 rounded px-3 focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="flex items-end">
                    <Button onClick={fetchLogs} className="h-12">
                        {loading ? "Loading…" : "Fetch Logs"}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-700 w-full max-w-3xl">
                    {error}
                </div>
            )}

            {/* Scrollable Logs Container -- need to look at it */}
            <div className="w-full max-w-3xl flex-1 overflow-y-auto space-y-4">
                {logs.length === 0 && !loading ? (
                    <div className="text-gray-500">No logs to display. Click “Fetch Logs.”</div>
                ) : null}

                {logs.map((log) => (
                    <div
                        key={log._id}
                        className="bg-white rounded-lg p-4 shadow border border-gray-200"
                    >
                        <div className="text-sm text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                        </div>
                        <div className="mt-2">
                            <span className="font-medium">Method:</span> {log.method}
                        </div>
                        <div>
                            <span className="font-medium">URL:</span> {log.url}
                        </div>
                        <div>
                            <span className="font-medium">Status:</span> {log.statusCode}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}