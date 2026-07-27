import { RunState, Action, Card, RunStatus } from './types';
import { buildDeck, shuffle } from './deck';
import { createRng } from './rng';
import { scoreHand } from './scoring';

const targets = [180, 320, 500, 760, 1120, 1600, 220, 3000];

export function createRun(seed : number) : RunState {
    const deck : Card[] = buildDeck();
    const shuffled : Card[] = shuffle(deck, createRng(seed))
    const hand : Card[] = shuffled.slice(0, 7);

    const run : RunState = {
        seed: seed,
        round: 1,
        target: 180,
        roundScore: 0,
        totalScore: 0,
        hand: hand,
        deck: shuffled,
        drawIndex: 8,
        handsLeft: 4,
        discardsLeft: 3,
        status: 'playing',
    }
    return run;
}

export function applyAction(action: Action, runState: RunState) : RunState {
    if ( runState.status === 'won') return runState;
    let updatedRunState : RunState = {...runState};
    const { roundScore, totalScore, handsLeft, drawIndex, target, hand, round, discardsLeft, seed } = runState;
    const removePlayedCards : Card[] = [...runState.deck].filter((card, idx) => !action.cards.includes(idx))
    const updatedDrawIndex : number = drawIndex + action.cards.length;
    const updatedHand : Card[] = [...removePlayedCards, ...runState.deck.slice(drawIndex, updatedDrawIndex)]
    switch(action.type) {
        case 'play':
            if( handsLeft > 0 && action.cards.length > 0 && action.cards.length < 6) {
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
                    } else { // move on to next round
                        // shuffle deck
                        const shuffleDeck : Card[] = shuffle(updatedRunState.deck, createRng(seed + round))
                        const updatedHand : Card[] = shuffleDeck.slice(0, 8); 
                        updatedRunState = {
                            ...updatedRunState,
                            target: targets[round - 1],
                            round: round + 1,
                            roundScore: 0,
                            drawIndex: 8,
                            hand: updatedHand,
                            deck: shuffleDeck,
                            handsLeft: 4,
                            discardsLeft: 3
                        }
                        return updatedRunState;
                    }
                }
            }
            break;
        case 'discard':
            if( discardsLeft > 0 && action.cards.length > 0 && action.cards.length < 6) {
                updatedRunState = {
                    ...updatedRunState, 
                    discardsLeft: discardsLeft - 1,
                }
            }
            break;
        default:
            break;
    }
    updatedRunState = {
        ...updatedRunState,
        hand: updatedHand,
        drawIndex: updatedDrawIndex,
    }
    return updatedRunState;
}

export function isRunOver( state: RunState ) : boolean {
    return state.status !== 'playing';
}