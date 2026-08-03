import { describe, it, expect, beforeEach } from 'vitest';
import { createRun, applyAction, isRunOver, roundsSurvived } from './run';
import { Action, RunState, RunStatus } from './types';

describe('createRun', () => {
    it('should create the same shuffled deck from a given seed', () => {
        const seed : number = 12345;
        const runA : RunState = createRun(seed);
        const runB : RunState = createRun(seed);
        expect(runA.deck).toEqual(runB.deck);
    })
})

describe('applyAction', () => {
    const seed : number = 12345;
    let runState : RunState;
    beforeEach(() => {
        runState = createRun(seed);
    })
    it('should return the same state if status is won', () => {
       runState = {...runState, status: 'won'}
        const stateAfterApply : RunState = applyAction({type:'play', cards: [1,2,3]}, runState )
        expect(stateAfterApply).toEqual(runState)
    })

    it('should set status to lose if target is not met within given hands', () => {
        runState = {...runState,
            handsLeft: 1,
        }
        runState = applyAction({type: 'play', cards: [1]}, runState);
        expect(runState.status).toEqual('lost');
    })

    it('should set status to won if target is met on round 8', () => {
        runState = {...runState,
            round: 8,
            roundScore: 2999
        }
        runState = applyAction({type: 'play', cards: [1]}, runState);
        expect(runState.status).toEqual('won');
    })

    it('should advance to the next round if target is met', () => {
        runState = {...runState,
            roundScore: 179
        }
        runState = applyAction({type: 'play', cards: [1]}, runState);
        expect(runState.round).toEqual(2);
    })
    it('should enter the shop phase without reshuffling when a round clears', () => {
        runState = {...runState,
            roundScore: 179
        }
        const updatedRunState : RunState = applyAction({type: 'play', cards: [1]}, runState);
        expect(updatedRunState.phase).toEqual('shop');
        expect(updatedRunState.deck).toEqual(runState.deck);
    })
    it('should reshuffle and deal a fresh hand when leaving the shop', () => {
        runState = {...runState,
            roundScore: 179
        }
        const shopState : RunState = applyAction({type: 'play', cards: [1]}, runState);
        const nextRoundState : RunState = applyAction({type: 'leaveShop'}, shopState);
        expect(nextRoundState.phase).toEqual('playing');
        expect(nextRoundState.deck).not.toEqual(shopState.deck);
        expect(nextRoundState.hand).toHaveLength(8);
        expect(nextRoundState.handsLeft).toEqual(4);
        expect(nextRoundState.discardsLeft).toEqual(3);
    })
    it('rejects leaveShop when not in the shop phase', () => {
        const result = applyAction({type: 'leaveShop'}, runState);
        expect(result).toBe(runState);
    })
    it('rejects play and discard while in the shop phase', () => {
        runState = {...runState,
            roundScore: 179
        }
        const shopState : RunState = applyAction({type: 'play', cards: [1]}, runState);
        const result = applyAction({type: 'discard', cards: [0]}, shopState);
        expect(result).toBe(shopState);
    })
    it('should fill the hand with new cards when playing or discarding cards', () => {
        let updatedRunState = applyAction({type: 'play', cards: [1]}, runState);
        expect(updatedRunState.hand).not.toEqual(runState.hand);
        updatedRunState = applyAction({type: 'discard', cards: [1]}, runState);
        expect(updatedRunState.hand).not.toEqual(runState.hand);
    })
    it('should decrement discardsLeft when discarding cards', () => {
        runState = applyAction({type: 'discard', cards: [1]}, runState);
        expect(runState.discardsLeft).toEqual(2);
    })
    it('should decrement handsLeft when playing cards', () => {
        runState = applyAction({type: 'play', cards: [1]}, runState);
        expect(runState.handsLeft).toEqual(3);
    })
    it('should increase drawIndex by the number of cards played', () => {
        runState = applyAction({type: 'play', cards: [1,2,3,4,5]}, runState);
        expect(runState.drawIndex).toEqual(13);
    })
})

describe('purchase', () => {
    const seed: number = 12345;
    let shopState: RunState;
    beforeEach(() => {
        shopState = { ...createRun(seed), phase: 'shop', money: 10 };
    })

    it('deducts money and records ownership on a successful purchase', () => {
        const result = applyAction({ type: 'purchase', itemId: 'extraHand' }, shopState);
        expect(result.money).toEqual(5);
        expect(result.ownedItems).toContain('extraHand');
    })

    it('rejects a purchase when not in the shop phase', () => {
        const playingState = {...shopState, phase: 'playing' as const};
        const result = applyAction({ type: 'purchase', itemId: 'extraHand' }, playingState);
        expect(result).toBe(playingState);
    })

    it('rejects buying an item already owned', () => {
        const owned = {...shopState, ownedItems: ['extraHand' as const]};
        const result = applyAction({ type: 'purchase', itemId: 'extraHand'}, owned);
        expect(result).toBe(owned);
    })

    it('rejects a purchase when money is short of the price', () => {
        const poor = {...shopState, money:4};
        const result = applyAction({ type: 'purchase', itemId: 'extraHand'}, poor);
        expect(result).toBe(poor);
    })

    it('allows a purchase when money exactly equals the price', () => {
        const exact = {...shopState, money:5};
        const result = applyAction({ type: 'purchase', itemId: 'extraHand'}, exact);
        expect(result.money).toEqual(0);
        expect(result.ownedItems).toContain('extraHand')
    })

    it('owning one item does not block buying the other', () => {
        const ownsHand = {...shopState, ownedItems: ['extraHand' as const]};
        const  result = applyAction({ type: 'purchase', itemId: 'extraDiscard'}, ownsHand);
        expect(result.ownedItems).toContain('extraDiscard');
    })

    it("extraHand raises handsLeft once the next round starts", () => {
        const afterPurchase = applyAction({ type: 'purchase', itemId: 'extraHand'}, shopState);
        const afterLeave = applyAction({ type: 'leaveShop'}, afterPurchase)
        expect(afterLeave.handsLeft).toEqual(5);
    })
    
    it("extraDiscard raises discardsLeft once the next round starts", () => {
        const afterPurchase = applyAction({ type: 'purchase', itemId: 'extraDiscard'}, shopState);
        const afterLeave = applyAction({ type: 'leaveShop'}, afterPurchase)
        expect(afterLeave.discardsLeft).toEqual(4);
    })

})

describe('isRunOver', () => {
    const seed : number = 12345;
    let runState : RunState;
    beforeEach(() => {
        runState = createRun(seed);
    })
    it('should return true when status is won', () => {
        runState = {...runState,
            status: 'won'
        }
        const result : boolean = isRunOver(runState)
        expect(result).toBe(true)
    })
    it('should return true when status is lost', () => {
        runState = {...runState,
            status: 'lost'
        }
        const result : boolean = isRunOver(runState)
        expect(result).toBe(true)
    })
    it('should return false when status is playing', () => {
        runState = {...runState,
            status: 'playing'
        }
        const result : boolean = isRunOver(runState)
        expect(result).toBe(false)
    })
})
const LOG: Action[] = [
    {type: 'discard', cards: [0,1] },
    {type: 'play', cards: [0,1,2,3,4] },
    {type: 'play', cards: [0,1,2] },
    {type: 'discard', cards: [0,1] },
    {type: 'discard', cards: [0,1] },
    {type: 'play', cards: [0,1,2] },
]
const replay = (seed: number, log: Action[]) => log.reduce((state, action) => applyAction(action, state), createRun(seed))
describe('run determinism', () => {
    it('reaches an identical final state from the same seed and log', () => {
        const a = replay(20260724, LOG);
        const b = replay(20260724, LOG);
        expect(a).toEqual(b);
    })
    it('reaches a different final state from different seeds and same log', () => {
        const a = replay(20260724, LOG);
        const b = replay(20260725, LOG);
        expect(a).not.toEqual(b);
    })
    it('plays a round, status is one of the three statuses and handsLeft is not negative', () => {
        const a = replay(20260724, LOG);
        expect(a.status).toBeOneOf(['playing', 'won', 'lost'])
        expect(a.handsLeft).toBeGreaterThan(0);
    })
    it('produces the same final score from the same seed and log', () => {
        const a = replay(20260724, LOG);
        const b = replay(20260724, LOG);
        expect(a.totalScore).toEqual(b.totalScore);
    })
})

describe('roundsSurvived', () => {
    it('equals round on a win', () => {
        expect(roundsSurvived('won', 8)).toEqual(8)
    })
    
    it('equals round minus one on a loss', () => {
        expect(roundsSurvived('lost', 4)).toEqual(3);
    })

    it('is zero when losing on the first round', () => {
        expect(roundsSurvived('lost', 1)).toEqual(0);
    })
})