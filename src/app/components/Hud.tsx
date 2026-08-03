type HudProps = {
    round: number;
    target: number;
    roundScore: number;
    totalScore: number;
};

const TOTAL_ROUNDS = 8;

export function Hud({ round, target, roundScore, totalScore}: HudProps) {
    const progressPercent = Math.min(100, (roundScore / target) * 100);

    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <div className="flex items-center gap-6 text-sm text-neutral-400">
                <span>Round {round} of {TOTAL_ROUNDS}</span>
                <span>Total Score: {totalScore.toLocaleString()}</span>
            </div>
            <span className="font-semibold">
                {roundScore.toLocaleString()} / {target.toLocaleString()} 
            </span>
            <div className="h-2 w-64 overflow-hidden rounded-full bg-neutral-200">
                <div
                    className="h-full rounded-full bg-indigo-600 transition-[width] duration-300"
                    style={{ width: `${progressPercent}%` }} 
                />
            </div>
        </div>
    );
}