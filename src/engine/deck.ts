import type { Card, Suit } from './types';

const SUITS: Suit[] = ['H', 'D', 'C', 'S'];

export function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function shuffle(cards: Card[], rng: () => number): Card[] {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
