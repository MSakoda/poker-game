import type { Card as CardData } from '@/engine/types';
import { cn } from '@/lib/utils';

const RANK_LABELS: Record<number, string> = {
    1: 'A',
    11: 'J',
    12: 'Q',
    13: 'K',
};

const SUIT_SYMBOLS: Record<CardData['suit'], string> = {
    H: '♥',
    D: '♦',
    C: '♣',
    S: '♠',
}

const SUIT_COLORS: Record<CardData['suit'], string> = {
    H: 'text-red-600',
    D: 'text-orange-500',
    C: 'text-blue-600',
    S: 'text-neutral-900',
}


type CardProps = {
    card: CardData;
    selected?: boolean;
    onClick?: () => void;
};

export function Card({ card, selected = false, onClick }: CardProps) {
    const label = RANK_LABELS[card.rank] ?? String(card.rank);

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            aria-label={`${label} of ${card.suit}`}
            className={cn(
                'transition-all duration-200',
                'flex h-[90px] w-16 flex-col items-center justify-center gap-1',
                'rounded-lg border bg-white text-xl font-semibold',
                'transition-transform duration-100 ease-out',
                'hover:-translate-y-1',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600',
                SUIT_COLORS[card.suit],
                selected
                    ? '-translate-y-4 border-indigo-600 shadow-lg hover:-translate-y-3'
                    : 'border-neutral-300',
            )}
        >
            <span>{label}</span>
            <span>{SUIT_SYMBOLS[card.suit]}</span>    
        </button>
    );
}