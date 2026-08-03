import { useState } from 'react';
import type { RunStatus } from '@/engine/types';
import { roundsSurvived } from '@/engine/run';

type RunSummaryProps = {
    status: RunStatus;
    round: number;
    totalScore: number;
    seed: number;
};

export function RunSummary({ status, round, totalScore, seed}: RunSummaryProps) {
    const rounds = roundsSurvived(status, round);
    const [copied, setCopied] = useState(false);

    async function handleShare() {
        const url = `${window.location.origin}/play?seed=${seed}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-950 p-8 text-neutral-100">
            <h1 className="text-2xl font-bold">
                {status === 'won' ? 'You cleared the run!' : 'Run over'}
            </h1>
            <p>Final Score: {totalScore.toLocaleString()}</p>
            <p>Rounds Survived: {rounds}</p>
            <p className="text-sm text-neutral-400">Seed: {seed}</p>
            <button
                type="button"
                onClick={handleShare}
                className="rounded-md border border-neutral-500 bg-neutral-800 px-6 py-2 font-semibold text-neutral-100"
            >
                {copied ? "Copied!" : "Copy Share Link"}
            </button>
        </div>
    );
}