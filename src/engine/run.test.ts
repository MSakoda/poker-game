import { describe, it, expect, beforeEach } from 'vitest';
import { createRun, applyAction, isRunOver } from './run';
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
    it('should shuffle the deck when moving on to new round', () => {
        runState = {...runState,
            roundScore: 179
        }
        const updatedRunState : RunState = applyAction({type: 'play', cards: [1]}, runState);
        expect(updatedRunState.deck).not.toEqual(runState.deck);
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
})