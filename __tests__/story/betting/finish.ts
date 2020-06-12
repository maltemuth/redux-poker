import { createStore, Store } from "redux";
import createPokerTableReducer from "../../../src/createPokerReducer";
import player from "../../lib/player";
import {
  PokerTableState,
  BettingRoundType,
} from "../../../src/PokerTableState";
import {
  PokerAction,
  addSpectator,
  seatSpectator,
  setPlayerReady,
  placeBet,
  fold,
} from "../../../src/actions";
import getNextPlayer from "../../../src/model/player/getNextPlayer";

describe("ending a round by folding", () => {
  let game: Store<PokerTableState, PokerAction>;

  const players = [player(1), player(2), player(3)];

  beforeEach(() => {
    game = createStore(createPokerTableReducer());
    players.forEach((player) => game.dispatch(addSpectator(player)));
    players.forEach((player) =>
      game.dispatch(seatSpectator(player, player.seat))
    );
    players.forEach((player) => game.dispatch(setPlayerReady(player)));
  });

  test("when small and big blind folds, the dealer wins", () => {
    const table = game.getState();
    const dealerInFirstRound = table.players.find(
      ({ id }) => id === table.dealer
    );
    const smallBlind = getNextPlayer(table.players, table.dealer);
    const bigBlind = getNextPlayer(table.players, smallBlind.id);

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 4,
        playerId: table.currentRound.currentPlayer,
      })
    );

    game.dispatch(fold(smallBlind));
    game.dispatch(fold(bigBlind));

    const tableAfterFolds = game.getState();

    const dealerNow = tableAfterFolds.players.find(
      ({ id }) => id === dealerInFirstRound!.id
    )!;

    expect(tableAfterFolds.currentRound.bettingRound).toEqual(
      BettingRoundType.PreFlop
    );
    expect(tableAfterFolds.dealer).toEqual(smallBlind.id);
    // should have won 3 small blinds, but now has bet 2 as big blind
    expect(dealerNow.chips).toEqual(3000 + table.smallBlind * 1);
  });
});
