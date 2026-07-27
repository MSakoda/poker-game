export type Suit = 'H' | 'D' | 'C' | 'S';

/** rank is 1-13, ace low (1 = Ace, 11 = Jack, 12 = Queen, 13 = King) */
export type Card = {
  rank: number;
  suit: Suit;
};

export type HandType =
  | 'HighCard'
  | 'Pair'
  | 'TwoPair'
  | 'ThreeOfAKind'
  | 'Straight'
  | 'Flush'
  | 'FullHouse'
  | 'FourOfAKind'
  | 'StraightFlush';

  export type RunStatus = 'playing' | 'won' | 'lost';

  export interface RunState {
    seed: number; 
    round: number; // 1 through 8
    target: number; // score needed to clear this round
    roundScore: number; // progress toward target, resets each round
    totalScore: number; // run-wide total, the final number
    hand: Card[]; // cards currently in front of you
    deck: Card[]; // this round's shuffled deck
    drawIndex: number; // next card to deal, an int not a generator
    handsLeft: number; // 4 per round
    discardsLeft: number; // 3 per round
    status: RunStatus;
  }

  export type Action = 
  | { type: 'play';
    cards: number[]
  }
  | {
    type: 'discard';
    cards: number[]
  };