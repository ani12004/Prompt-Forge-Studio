"use client";

import { useState, useEffect } from "react";

interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    created_at: string;
    last_used_at: string | null;
    revoked: boolean;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [newKeyName, setNewKeyName] = useState("");
    const [createdRawKey, setCreatedRawKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Hardcoded for MVP dashboard integration until global session state is injected
    const USER_ID = "00000000-0000-0000-0000-000000000000";

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        const res = await fetch(`/api/v1/keys?userId=${USER_ID}`);
        if (res.ok) {
            const data = await res.json();
            setKeys(data.keys || []);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName) return;
        setLoading(true);
        setCreatedRawKey(null);

        const res = await fetch("/api/v1/keys", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newKeyName, userId: USER_ID }),
        });

        if (res.ok) {
            const data = await res.json();
            setCreatedRawKey(data.rawKey);
            setNewKeyName("");
            fetchKeys();
        }
        setLoading(false);
    };

    const handleRevoke = async (keyId: string) => {
        if (!confirm("Are you sure you want to revoke this key?")) return;

        await fetch("/api/v1/keys/revoke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyId, userId: USER_ID }),
        });
        fetchKeys();
    };

    const copyToClipboard = () => {
        if (createdRawKey) {
            navigator.clipboard.writeText(createdRawKey);
            alert("Copied to clipboard!");
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 bg-[#050508] text-white min-h-screen">
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-gray-400">Manage your programmatic access keys for the V2 API engine.</p>

            {createdRawKey && (
                <div className="bg-purple-900/40 border border-purple-500 p-4 rounded-xl space-y-2">
                    <h2 className="text-lg font-semibold text-purple-300">Your New API Key</h2>
                    <p className="text-sm text-gray-300">Please copy this key now. You will not be able to see it again.</p>
                    <div className="flex items-center gap-4 bg-black/50 p-3 rounded font-mono text-sm">
                        <span className="flex-1 break-all">{createdRawKey}</span>
                        <button
                            onClick={copyToClipboard}
                            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                <h2 className="text-xl font-semibold">Create New Key</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Key Name (e.g., Production App)"
                        className="flex-1 bg-black/50 border border-white/10 rounded px-4 py-2 focus:border-purple-500 focus:outline-none"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !newKeyName}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-6 py-2 rounded font-medium transition-colors"
                    >
                        Create
                    </button>
                </div>
            </form>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Active Keys</h2>
                {keys.length === 0 ? (
                    <p className="text-gray-500 italic">No keys generated yet.</p>
                ) : (
                    <div className="space-y-3">
                        {keys.map(key => (
                            <div key={key.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium flex items-center gap-2">
                                        {key.name}
                                        {key.revoked && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded">Revoked</span>}
                                    </h3>
                                    <div className="text-sm text-gray-400 font-mono mt-1">
                                        {key.prefix}****************
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                        Created: {new Date(key.created_at).toLocaleDateString()}
                                        {key.last_used_at && ` • Last Used: ${new Date(key.last_used_at).toLocaleDateString()}`}
                                    </div>
                                </div>
                                {!key.revoked && (
                                    <button
                                        onClick={() => handleRevoke(key.id)}
                                        className="text-red-400 hover:text-red-300 text-sm font-medium p-2"
                                    >
                                        Revoke
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
