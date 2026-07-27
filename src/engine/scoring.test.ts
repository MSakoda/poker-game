import { describe, expect, it } from 'vitest';
import { classifyHand, chipValue, scoreHand } from './scoring';
import type { Card } from './types';

function cards(spec: Array<[number, Card['suit']]>): Card[] {
  return spec.map(([rank, suit]) => ({ rank, suit }));
}

describe('classifyHand', () => {
  it('classifies a high card hand', () => {
    const hand = cards([
      [2, 'H'],
      [5, 'D'],
      [9, 'C'],
      [11, 'S'],
      [13, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('HighCard');
  });

  it('classifies a short hand of two matching cards as a Pair', () => {
    const hand = cards([
      [7, 'H'],
      [7, 'S'],
    ]);
    expect(classifyHand(hand)).toBe('Pair');
  });

  it('classifies a five-card pair hand', () => {
    const hand = cards([
      [4, 'H'],
      [4, 'D'],
      [9, 'C'],
      [11, 'S'],
      [13, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('Pair');
  });

  it('classifies two pair', () => {
    const hand = cards([
      [4, 'H'],
      [4, 'D'],
      [9, 'C'],
      [9, 'S'],
      [13, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('TwoPair');
  });

  it('classifies three of a kind', () => {
    const hand = cards([
      [6, 'H'],
      [6, 'D'],
      [6, 'C'],
      [9, 'S'],
      [13, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('ThreeOfAKind');
  });

  it('classifies a ten-through-ace straight', () => {
    const hand = cards([
      [10, 'H'],
      [11, 'D'],
      [12, 'C'],
      [13, 'S'],
      [1, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('Straight');
  });

  it('classifies the wheel (A-2-3-4-5) as a straight', () => {
    const hand = cards([
      [1, 'H'],
      [2, 'D'],
      [3, 'C'],
      [4, 'S'],
      [5, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('Straight');
  });

  it('classifies a flush', () => {
    const hand = cards([
      [2, 'H'],
      [5, 'H'],
      [9, 'H'],
      [11, 'H'],
      [13, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('Flush');
  });

  it('classifies a full house', () => {
    const hand = cards([
      [8, 'H'],
      [8, 'D'],
      [8, 'C'],
      [3, 'S'],
      [3, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('FullHouse');
  });

  it('classifies four of a kind', () => {
    const hand = cards([
      [5, 'H'],
      [5, 'D'],
      [5, 'C'],
      [5, 'S'],
      [13, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('FourOfAKind');
  });

  it('classifies a straight flush', () => {
    const hand = cards([
      [4, 'H'],
      [5, 'H'],
      [6, 'H'],
      [7, 'H'],
      [8, 'H'],
    ]);
    expect(classifyHand(hand)).toBe('StraightFlush');
  });

  it('classifies a wheel straight flush', () => {
    const hand = cards([
      [1, 'S'],
      [2, 'S'],
      [3, 'S'],
      [4, 'S'],
      [5, 'S'],
    ]);
    expect(classifyHand(hand)).toBe('StraightFlush');
  });
});

describe('chipValue', () => {
  it('returns 11 for an Ace', () => {
    const ace: Card = { rank: 1, suit: 'H' };
    expect(chipValue(ace.rank)).toBe(11);
  })
  
  it('should return 10 for face cards', () => {
    const faceCards: Card[] = [
      { rank: 11, suit: 'H' },
      { rank: 12, suit: 'H' },
      { rank: 13, suit: 'H' },
    ]
    for (const card of faceCards) {
      expect(chipValue(card.rank)).toBe(10);
    }
  })

  it('should return the rank for numbered cards', () => {
    const numberedCards: Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 3, suit: 'H' },
      { rank: 4, suit: 'H' },
      { rank: 5, suit: 'H' },
      { rank: 6, suit: 'H' },
      { rank: 7, suit: 'H' },
      { rank: 8, suit: 'H' },
      { rank: 9, suit: 'H' },
    ]
    for (const card of numberedCards) {
      expect(chipValue(card.rank)).toBe(card.rank);
    }
  })
})

describe('scoreHand', () => {
  it('high card hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 5, suit: 'H' },
      { rank: 7, suit: 'D' },
      { rank: 9, suit: 'H' },
      { rank: 11, suit: 'H' },
    ]
    expect(scoreHand(hand)).toBe(2 + 5 + 7 + 9 + 10 + 5);
  })

  it('pair hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 2, suit: 'D' }
    ]
    expect(scoreHand(hand)).toBe((2 + 2 + 10) * 2);
  })

  it('two pair hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 2, suit: 'D' },
      { rank: 3, suit: 'H' },
      { rank: 3, suit: 'D' },
    ]
    expect(scoreHand(hand)).toBe((2 + 2 + 3 + 3 + 20) * 2);
  })

  it('three of a kind hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 2, suit: 'D' },
      { rank: 2, suit: 'C' },
    ]
    expect(scoreHand(hand)).toBe((2 + 2 + 2 + 30) * 3);
  })

  it('straight hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 3, suit: 'D' },
      { rank: 4, suit: 'C' },
      { rank: 5, suit: 'D' },
      { rank: 6, suit: 'C' },
    ]
    expect(scoreHand(hand)).toBe((2 + 3 + 4 + 5 + 6 + 30) * 4);
  })

  it('flush hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 7, suit: 'H' },
      { rank: 4, suit: 'H' },
      { rank: 5, suit: 'H' },
      { rank: 6, suit: 'H' },
    ]
    expect(scoreHand(hand)).toBe((2 + 7 + 4 + 5 + 6 + 35) * 4);
  })

  it('full house hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 2, suit: 'D' },
      { rank: 2, suit: 'C' },
      { rank: 3, suit: 'H' },
      { rank: 3, suit: 'D' },
    ]
    expect(scoreHand(hand)).toBe((2 + 2 + 2 + 3 + 3 + 40) * 4);
  })

  it('four of a kind hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 2, suit: 'D' },
      { rank: 2, suit: 'C' },
      { rank: 2, suit: 'S' },
      { rank: 3, suit: 'D' },
    ]
    expect(scoreHand(hand)).toBe((2 + 2 + 2 + 2 + 3 + 60) * 7);
  })
  it('straight flush hand', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 3, suit: 'H' },
      { rank: 4, suit: 'H' },
      { rank: 5, suit: 'H' },
      { rank: 6, suit: 'H' },
    ]
    expect(scoreHand(hand)).toBe((2 + 3 + 4 + 5 + 6 + 100) * 8);
  })

  it('the multiplier is applied to the whole total, not just the base', () => {
    const hand : Card[] = [
      { rank: 2, suit: 'H' },
      { rank: 3, suit: 'H' },
      { rank: 4, suit: 'H' },
      { rank: 5, suit: 'H' },
      { rank: 6, suit: 'H' },
    ]
    expect(scoreHand(hand)).toBe((2 + 3 + 4 + 5 + 6 + 100) * 8);
  })
})
