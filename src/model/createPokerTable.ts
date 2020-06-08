import { PokerTableState, BettingRoundType } from "../PokerTableState";

const createPokerTable = (): PokerTableState => ({
  players: [],
  spectators: [],
  leavingPlayers: [],
  currentRound: {
    bets: [],
    currentPlayer: "",
    lastPlayerActions: [],
    pots: [],
    bettingRound: BettingRoundType.PreFlop,
    amountNeededForCalling: 0,
    lastPlayerToRaise: "",
  },
  board: [],
  flop: [],
  river: [],
  turn: [],
  dealer: "",
  lastSmallBlindIncrease: null,
  smallBlind: 0,
  startedAt: null,
  finishedAt: null,
  retiredPlayers: [],
});

export default createPokerTable;
