import { HAND_VALUES } from "@/engine/scoring";
import type { HandType } from '@/engine/types';

const HAND_TYPE_LABELS: Record<HandType, string> = {
    HighCard: 'High Card',
    Pair: 'Pair',
    TwoPair: 'Two Pair',
    ThreeOfAKind: 'Three of a Kind',
    Straight: 'Straight',
    Flush: 'Flush',
    FullHouse: 'Full House',
    FourOfAKind: 'Four Of a Kind',
    StraightFlush: 'Straight Flush',
};

const HAND_ENTRIES = Object.entries(HAND_VALUES) as [
    HandType,
    { base: number; mult: number},
][];

export function RulesPanel() {
    return (
        <table className="w-full max-w-sm border-collapse text-sm">
            <thead>
                <tr className="border-b border-neutral-300 text-left text-neutral-500">
                    <th className="py-2">Hand</th>
                    <th className="py-2 text-right">Base</th>
                    <th className="py-2 text-right">Mult</th>
                </tr>
            </thead>
            <tbody>
                {HAND_ENTRIES.map(([type, {base, mult}]) => (
                    <tr key={type} className="border-b border-neutral-100">
                        <td className="py-2">{HAND_TYPE_LABELS[type]}</td>
                        <td className="py-2 text-right">{base}</td>
                        <td className="py-2 text-right">{mult}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}