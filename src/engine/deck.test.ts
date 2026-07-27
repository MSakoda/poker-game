import { describe, expect, it } from 'vitest';
import { buildDeck, shuffle } from './deck';
import { createRng } from './rng';

describe('shuffle', () => {
    it('produces the same result for the same seed', () => {
        const seed = 12345;
        const deck = buildDeck();
        const shuffled1 = shuffle(deck, createRng(seed));
        const shuffled2 = shuffle(deck, createRng(seed));
        expect(shuffled1).toEqual(shuffled2);
    });

    it('does not mutate the original deck', () => {
        const deck = buildDeck();
        const deckParsed = JSON.stringify(deck);
        shuffle(deck, createRng(12345));
        expect(JSON.parse(JSON.stringify(deck))).toEqual(JSON.parse(deckParsed));
    });

    it('returns a permutation, all 52 cards, none lost, none duplicated', () => {
        const deck = buildDeck();
        const shuffled = shuffle(deck, createRng(12345));
        expect(shuffled.length).toBe(52);
        const uniqueCards = new Set(shuffled.map(card => `${card.rank}-${card.suit}`));
        expect(uniqueCards.size).toBe(52);
    })
});