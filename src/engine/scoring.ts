import type { Card, HandType } from './types';

// TODO: implement hand classification logic.
export function classifyHand(cards: Card[]): HandType {
  let handType: HandType = 'HighCard';
  const isFlush = cards.every((card) => card.suit === cards[0].suit) && cards.length === 5;
  const ranks = cards.map((card) => card.rank).sort((a, b) => a - b);
  const isStraight = ranks[4] === ranks[0] + 4 || ranks.join(',') === '1,10,11,12,13';
  if( isFlush && isStraight) {
    handType = 'StraightFlush';
  } else if (isFlush) {
    handType = 'Flush';
  } else if (isStraight) {
    handType = 'Straight';
  }
  // check for pairs, three of a kind, four of a kind, full house
  const rankCounts: Record<number, number> = {};
  for (const card of cards) {
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  }
  // Determine the highest-ranking hand based on rank counts
  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  if (counts[0] === 4) {
    handType = 'FourOfAKind';
  } else if (counts[0] === 3 && counts[1] === 2) {
    handType = 'FullHouse';
  } else if (counts[0] === 3) {
    handType = 'ThreeOfAKind';
  } else if (counts[0] === 2 && counts[1] === 2) {
    handType = 'TwoPair';
  } else if (counts[0] === 2) {
    handType = 'Pair';
  }
  return handType;
}

const HAND_VALUES: Record<HandType, { base: number; mult: number }> = {
  HighCard:     { base: 5,   mult: 1 },
  Pair:         { base: 10,  mult: 2 },
  TwoPair: { base: 20, mult: 2 },
  ThreeOfAKind: { base: 30, mult: 3 },
  Straight: { base: 30, mult: 4 },
  Flush: { base: 35, mult: 4 },
  FullHouse: { base: 40, mult: 4 },
  FourOfAKind: { base: 60, mult: 7 },
  StraightFlush: { base: 100, mult: 8 },
};

export function chipValue(rank: number): number {
    return rank === 1 ? 11 : rank >= 11 ? 10 : rank;
}

export function scoreHand(cards: Card[]): number {
  const type = classifyHand(cards);
  console.log( 'type:', type )
  const { base, mult } = HAND_VALUES[type];
  console.log( 'base:', base, 'mult:', mult )
  const sumOfChipValues = cards.reduce((sum, card) => sum + chipValue(card.rank), 0);
  console.log( 'sumOfChipValues:', sumOfChipValues )
  return (base + sumOfChipValues) * mult;
}
