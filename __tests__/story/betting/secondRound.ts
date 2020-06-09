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

describe("betting in the second round", () => {
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

  test("first player to have an action is the small blind", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    )!;
    const smallBlind = getNextPlayer(table.players, table.dealer);
    const bigBlind = getNextPlayer(table.players, smallBlind.id);

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 4,
        playerId: currentPlayer.id,
      })
    );

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 3,
        playerId: smallBlind.id,
      })
    );

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 2,
        playerId: bigBlind.id,
      })
    );

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bettingRound).toEqual(
      BettingRoundType.Flop
    );
    expect(tableAfterBet.currentRound.currentPlayer).toEqual(smallBlind.id);
  });

  test("if the small blind folded in the first round, the big blind starts the second", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    )!;
    const smallBlind = getNextPlayer(table.players, table.dealer);
    const bigBlind = getNextPlayer(table.players, smallBlind.id);

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 4,
        playerId: currentPlayer.id,
      })
    );

    game.dispatch(fold(smallBlind));

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 2,
        playerId: bigBlind.id,
      })
    );

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bettingRound).toEqual(
      BettingRoundType.Flop
    );
    expect(tableAfterBet.currentRound.currentPlayer).toEqual(bigBlind.id);
  });

  test("if the small blind folded in the first round, the small blind will not need to bet again", () => {
    const table = game.getState();
    const smallBlind = getNextPlayer(table.players, table.dealer);
    const bigBlind = getNextPlayer(table.players, smallBlind.id);

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 4,
        playerId: table.currentRound.currentPlayer,
      })
    );

    game.dispatch(fold(smallBlind));

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 2,
        playerId: bigBlind.id,
      })
    );

    game.dispatch(
      placeBet({
        amount: 0,
        playerId: bigBlind.id,
      })
    );

    game.dispatch(
      placeBet({
        amount: 0,
        playerId: table.dealer,
      })
    );

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bettingRound).toEqual(
      BettingRoundType.Turn
    );
    expect(tableAfterBet.currentRound.currentPlayer).toEqual(bigBlind.id);
  });
});
