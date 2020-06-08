import { Card } from "@malte.muth/poker-hands/dist/src/model/card/Card";

export enum BettingRoundType {
  PreFlop = "PreFlop",
  Flop = "Flop",
  Turn = "Turn",
  River = "River",
}

export enum PlayerActionType {
  Fold = "Fold",
  Check = "Check",
  Call = "Call",
  Raise = "Raise",
  AllIn = "AllIn",
}

export type PlayerId = string;

export interface Spectator {
  name: string;
  id: PlayerId;
}

export interface Player extends Spectator {
  isSittingOut: boolean;
  wantsToSitOut: boolean;
  isReady: boolean;
  chips: number;
  currentCards: Card[];
  revealedCards: Card[];
  wantsToShow: Card[];
  seat: number;
}

export interface RetiredPlayer extends Spectator {
  retiredAt: Date;
  place: number;
}

export interface Pot {
  amount: number;
  playerIds: PlayerId[];
}

export interface Bet {
  amount: number;
  playerId: PlayerId;
}

export interface PlayerState {
  playerId: PlayerId;
  folded: boolean;
}

export interface PlayerAction {
  playerId: PlayerId;
  actionType: PlayerActionType;
  betAmount: number;
}

export interface PokerTableState {
  players: Player[];
  spectators: Spectator[];
  leavingPlayers: PlayerId[];
  currentRound: {
    bettingRound: BettingRoundType;
    pots: Pot[];
    bets: Bet[];
    currentPlayer: PlayerId;
    lastPlayerActions: PlayerAction[];
    amountNeededForCalling: number;
    lastPlayerToRaise: PlayerId;
  };
  board: Card[];
  flop: Card[];
  river: Card[];
  turn: Card[];
  dealer: PlayerId;
  smallBlind: number;
  lastSmallBlindIncrease: Date | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  retiredPlayers: RetiredPlayer[];
}
