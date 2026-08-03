import { RunState, Action, Card, ShopItemId, RunStatus } from './types';
import { buildDeck, shuffle } from './deck';
import { createRng } from './rng';
import { scoreHand } from './scoring';

const targets = [180, 320, 500, 760, 1120, 1600, 220, 3000];

export const SHOP_PRICES: Record<ShopItemId, number> = {
    extraHand: 5,
    extraDiscard: 4,
}
const ROUND_CLEAR_PAYOUT = 4;

function handsPerRound(ownedItems: ShopItemId[]): number {
    return ownedItems.includes('extraHand') ? 5 : 4;
}

function discardsPerRound(ownedItems: ShopItemId[]): number {
    return ownedItems.includes('extraDiscard') ? 4 : 3;
}

export function createRun(seed : number) : RunState {
    const deck : Card[] = buildDeck();
    const shuffled : Card[] = shuffle(deck, createRng(seed))
    const hand : Card[] = shuffled.slice(0, 8);
    const ownedItems : ShopItemId[] = [];

    const run : RunState = {
        seed: seed,
        round: 1,
        target: 180,
        roundScore: 0,
        totalScore: 0,
        hand,
        deck: shuffled,
        drawIndex: 8,
        handsLeft: handsPerRound(ownedItems),
        discardsLeft: discardsPerRound(ownedItems),
        status: 'playing',
        phase: 'playing',
        money: 10,
        ownedItems,
    }
    return run;
}

export function applyAction(action: Action, runState: RunState) : RunState {
    if ( runState.status === 'won') return runState;

    if( action.type === 'leaveShop' ) {
        if( runState.phase !== 'shop') return runState;
        const { seed, round, ownedItems } = runState;
        const shuffleDeck: Card[] = shuffle(runState.deck, createRng(seed + round))
        const newHand: Card[] = shuffleDeck.slice(0,8);
        return {
            ...runState,
            phase: 'playing',
            roundScore: 0,
            drawIndex: 8,
            hand: newHand,
            deck: shuffleDeck,
            handsLeft: handsPerRound(ownedItems),
            discardsLeft: discardsPerRound(ownedItems),
        };
    }

    if (action.type === 'purchase') {
        if( runState.phase !== 'shop') return runState;
        if( runState.ownedItems.includes(action.itemId)) return runState;
        const price = SHOP_PRICES[action.itemId];
        if (runState.money < price) return runState;
        return {
            ...runState,
            money: runState.money - price,
            ownedItems: [...runState.ownedItems, action.itemId],
        };
    }

    if( runState.phase !== 'playing') return runState;

    const { roundScore, totalScore, handsLeft, drawIndex, target, hand, round, discardsLeft } = runState;

    const hasValidCardCount = action.cards.length > 0 && action.cards.length < 6;
    const hasResource = action.type === 'play' ? handsLeft > 0 : discardsLeft > 0;
    if( !hasValidCardCount || !hasResource) return runState;

    const remainingHand : Card[] = [...hand].filter((_card, idx) => !action.cards.includes(idx))
    const updatedDrawIndex : number = drawIndex + action.cards.length;
    const updatedHand : Card[] = [...remainingHand, ...runState.deck.slice(drawIndex, updatedDrawIndex)]

    let updatedRunState = { ...runState, hand: updatedHand, drawIndex: updatedDrawIndex};
    switch(action.type) {
        case 'play': {
                const cards : Card[] = action.cards.map(cardIdx => hand[cardIdx])
                const score : number = scoreHand(cards);
                const updatedHandsLeft : number = handsLeft - 1;
                updatedRunState = {
                    ...updatedRunState, 
                    roundScore: roundScore + score,
                    totalScore: totalScore + score,
                    handsLeft: updatedHandsLeft,
                    status: updatedHandsLeft === 0 ? 'lost' : 'playing'
                }
                if( roundScore + score > target ) {
                    if( round === 8 ) { // check if won game
                        updatedRunState = {...updatedRunState, status: 'won'}
                    } else { // round cleared, not the final round -stop in the shop before dealing the next one
                        updatedRunState = {
                            ...updatedRunState,
                            phase: 'shop',
                            target: targets[round],
                            round: round + 1,
                            money: updatedRunState.money + ROUND_CLEAR_PAYOUT,
                        }
                    }
                }
            break;
        }
        case 'discard':
            updatedRunState = {
                ...updatedRunState, 
                discardsLeft: discardsLeft - 1,
            }
            break;
    }
    return updatedRunState;
}

export function isRunOver( state: RunState ) : boolean {
    return state.status !== 'playing';
}

export function roundsSurvived(status: RunStatus, round: number): number {
    return status === 'won' ? round : round - 1;
}