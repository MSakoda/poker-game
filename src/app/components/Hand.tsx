import type { Card as CardData } from '@/engine/types';
import { Card } from './Card';
import { useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

type HandProps = {
    cards: CardData[];
    selected: number[];
    onToggle: (index: number) => void;
};

type SortMode = 'rank' | 'suit';

const SUIT_ORDER: Record<CardData['suit'], number> = {S:0, H:1, C: 2, D:3};

function sortIndexed(indexed: { card: CardData, index: number }[], mode: SortMode) {
    const sorted = [...indexed];
    if (mode === 'rank'){
        sorted.sort((a, b) => b.card.rank - a.card.rank);
    } else {
        sorted.sort(
            (a,b) => SUIT_ORDER[b.card.suit] - SUIT_ORDER[a.card.suit] || b.card.rank - a.card.rank
        )
    }
    return sorted;
}

export function Hand({ cards, selected, onToggle}: HandProps ) {
    const [sortMode, setSortMode] = useState<SortMode>('rank');
    const [ parent ] = useAutoAnimate<HTMLDivElement>();

    const indexed = cards.map((card, index) => ({ card, index }));
    const sorted = sortIndexed(indexed, sortMode);
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex gap-3 text-sm">
                <button
                    type="button"
                    onClick={() => setSortMode('rank')}
                    className={sortMode === 'rank' ? 'font-semibold text-neutral-100 underline' : 'text-neutral-400'}
                >
                    Sort: Rank
                </button>
                <button
                    type="button"
                    onClick={() => setSortMode('suit')}
                    className={sortMode === 'suit' ? 'font-semibold text-neutral-100 underline' : 'text-neutral-400'}
                >
                    Sort: Suit
                </button>
            </div>
            <div ref={parent} className="flex flex-wrap items-end justify-center gap-2 p-4">
                {sorted.map(({card, index}) => (
                    <Card
                        key={`${card.rank}-${card.suit}`}
                        card={card}
                        selected={selected.includes(index)}
                        onClick={() => onToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
}