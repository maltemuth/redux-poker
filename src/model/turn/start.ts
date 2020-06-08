import {
  PokerTableState,
  RetiredPlayer,
  Player,
  BettingRoundType,
} from "../../PokerTableState";
import finish from "../table/finish";
import startBettingRound from "../bettingRound/start";
import { shuffle, create } from "@malte.muth/poker-hands/dist/src";
import getNextPlayer from "../player/getNextPlayer";
import placeBet from "../player/placeBet";

const start = (table: PokerTableState): PokerTableState => {
  const playersNowRetiring = table.players.filter(
    (player) => player.chips <= 0
  );

  const remainingPlayers = table.players.filter((player) => player.chips > 0);
  const placement = remainingPlayers.length + 1;

  const newlyRetiredPlayers: RetiredPlayer[] = playersNowRetiring.map(
    ({ id, name }) => ({
      id,
      name,
      place: placement,
      retiredAt: new Date(),
    })
  );

  // sit out all players who want to sit out
  // and sit in all players who want to sit in
  const newActivePlayers = remainingPlayers.map((player) => {
    player.isSittingOut = player.wantsToSitOut ? true : false;

    return player;
  });

  const tableWithUpdatedPlayers: PokerTableState = {
    ...table,
    retiredPlayers: [...table.retiredPlayers, ...newlyRetiredPlayers],
    players: newActivePlayers,
  };

  if (remainingPlayers.length <= 1) {
    return finish(table);
  }

  let newDealer: Player = getNextPlayer(table.players, table.dealer);

  while (remainingPlayers.findIndex(({ id }) => id === newDealer.id) === -1) {
    newDealer = getNextPlayer(table.players, newDealer.id);
  }

  const updatedTable: PokerTableState = {
    ...tableWithUpdatedPlayers,
    dealer: newDealer.id,
  };

  const shuffledDeck = shuffle(create());

  const playersWithCards: Player[] = updatedTable.players.map((player) => {
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
    ...updatedTable,
    players: playersWithCards,
    board: [],
    flop,
    turn,
    river,
    currentRound: {
      bettingRound: BettingRoundType.PreFlop,
      pots: [],
      lastPlayerActions: [],
      currentPlayer: getNextPlayer(updatedTable.players, updatedTable.dealer, 3)
        .id,
      amountNeededForCalling: 0,
      bets: [],
      lastPlayerToRaise: "",
    },
  };

  const smallBlindPlayer = getNextPlayer(
    tableBeforeBettingStarts.players,
    updatedTable.dealer
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

  return startBettingRound(tableWithBigBlind);
};

export default start;
