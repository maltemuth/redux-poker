import {
  PokerTableState,
  Player,
  BettingRoundType,
  PlayerActionType,
} from "../../PokerTableState";
import { create, shuffle } from "@malte.muth/poker-hands/dist/src";
import placeBet from "../player/placeBet";
import getNextPlayer from "../player/getNextPlayer";

const start = (table: PokerTableState): PokerTableState => {
  const shuffledDeck = shuffle(create());

  const playersWithCards: Player[] = table.players.map((player) => {
    const cards = shuffledDeck.splice(0, 2);
    return {
      ...player,
      currentCards: cards,
      revealedCards: [],
      wantsToShow: [],
    };
  });

  const flop = shuffledDeck.splice(0, 3);
  const turn = shuffledDeck.splice(0, 1);
  const river = shuffledDeck.splice(0, 1);

  const tableBeforeBettingStarts: PokerTableState = {
    ...table,
    players: playersWithCards,
    board: [],
    flop,
    turn,
    river,
    currentRound: {
      ...table.currentRound,
      pots: [],
      lastPlayerActions: table.currentRound.lastPlayerActions.filter(
        (playerAction) =>
          playerAction.actionType !== PlayerActionType.AllIn &&
          playerAction.actionType !== PlayerActionType.Fold
      ),
      currentPlayer: table.dealer,
      amountNeededForCalling: 0,
      bets: [],
      lastPlayerToRaise: "",
    },
  };

  if (table.currentRound.bettingRound !== BettingRoundType.PreFlop) {
    return tableBeforeBettingStarts;
  }

  const smallBlindPlayer = getNextPlayer(
    tableBeforeBettingStarts.players,
    table.dealer
  );

  const bigBlindPlayer = getNextPlayer(
    tableBeforeBettingStarts.players,
    smallBlindPlayer.id
  );

  const tableWithSmallBlind = placeBet(
    tableBeforeBettingStarts,
    smallBlindPlayer,
    table.smallBlind
  );

  const tableWithBigBlind = placeBet(
    tableWithSmallBlind,
    bigBlindPlayer,
    table.smallBlind * 2
  );

  return tableWithBigBlind;
};

export default start;
