import type { ShopItemId } from "@/engine/types";
import { SHOP_PRICES } from '@/engine/run';

const ITEM_LABELS: Record<ShopItemId, string> = {
    extraHand: 'Extra Hand',
    extraDiscard: 'Extra Discard',
};

const ITEM_DESCRIPTIONS: Record<ShopItemId, string> = {
    extraHand: '+1 hand per round, permanently.',
    extraDiscard: '+1 discard per round, permanently.',
};

const ALL_ITEMS: ShopItemId[] = ['extraHand', 'extraDiscard'];

type ShopProps = {
    money: number;
    ownedItems: ShopItemId[];
    round: number;
    onPurchase: (itemId: ShopItemId) => void;
    onLeave: () => void;
}

export function Shop({ money, ownedItems, round, onPurchase, onLeave} :ShopProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-950 p-8 text-neutral-100">
            <h1 className="text-2xl font-bold">Shop -- Round {round}</h1>
            <p className="text-lg">Money: <span className="font-semibold text-amber-400">{money}</span></p>
            <div className="flex gap-4">
                {ALL_ITEMS.map((itemId) => {
                    const owned = ownedItems.includes(itemId);
                    const price = SHOP_PRICES[itemId];
                    const affordable = money >= price;
                    return (
                        <div key={itemId} className="flex w-48 flex-col items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 p-4">
                            <span className="font-semibold">{ITEM_LABELS[itemId]}</span>
                            <span className="text-center text-sm text-neutral-400">{ITEM_DESCRIPTIONS[itemId]}</span>
                            <button
                                type="button"
                                onClick={ () => onPurchase(itemId) }
                                disabled={owned || !affordable}
                                className="mt-auto rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {owned ? 'Owned' : `Buy - $${price}`}
                            </button>
                        </div>
                    );
                })}
            </div>
            <button
                type="button"
                onClick={onLeave}
                className="rounded-md border border-neutral-500 bg-neutral-800 px-6 py-2 font-semibold text-neutral-100"
            >
                Leave Shop →
            </button>
        </div>
    )
}