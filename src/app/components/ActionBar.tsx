type ActionBarProps = {
    selectedCount: number;
    handsLeft: number;
    discardsLeft: number;
    onPlay: () => void;
    onDiscard: () => void;
};


export function ActionBar({ selectedCount, handsLeft, discardsLeft, onPlay, onDiscard} : ActionBarProps ) {
    const hasSelection = selectedCount > 0;
    const canPlay = hasSelection && handsLeft > 0;
    const canDiscard = hasSelection && discardsLeft > 0;

    return (
        <div className="flex items-center gap-4 p-2">
            <button
                type="button"
                onClick={onPlay}
                disabled={!canPlay}
                className="rounded-md bg-indigo-600 px-6 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
                Play Hand ({handsLeft})
            </button>
            <button
                type="button"
                onClick={onDiscard}
                disabled={!canDiscard}
                className="rounded-md border border-neutral-500 bg-neutral-800 px-4 py-2 font-medium text-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Discard ({discardsLeft})
            </button>
        </div>
    );
}