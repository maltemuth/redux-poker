import { createStore, Store } from "redux";
import createPokerTableReducer from "../../../src/createPokerReducer";
import player from "../../lib/player";
import {
  PokerTableState,
  PlayerActionType,
  BettingRoundType,
} from "../../../src/PokerTableState";
import {
  PokerAction,
  addSpectator,
  seatSpectator,
  setPlayerReady,
  placeBet,
} from "../../../src/actions";
import getNextPlayer from "../../../src/model/player/getNextPlayer";

describe("betting in the first round", () => {
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

  test("small blind and big blinds are placed", () => {
    const table = game.getState();

    expect(table.currentRound.bets.length).toBe(2);
    expect(table.currentRound.bets.map(({ amount }) => amount)).toEqual(
      expect.arrayContaining([table.smallBlind, table.smallBlind * 2])
    );
  });

  test("current player is the dealer", () => {
    const table = game.getState();

    expect([table.currentRound.currentPlayer, table.dealer]).toEqual([
      table.currentRound.currentPlayer,
      table.dealer,
    ]);
  });

  test("current player has no bet yet", () => {
    const table = game.getState();

    expect(
      table.currentRound.bets.find(
        ({ playerId }) => playerId === table.currentRound.currentPlayer
      )
    ).toEqual(undefined);
  });

  test("first player cannot bet in pre-flop", () => {
    const table = game.getState();
    const firstPlayer = getNextPlayer(table.players, table.dealer);

    game.dispatch(placeBet({ amount: 100, playerId: firstPlayer.id }));

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bets.length).toEqual(2);
  });

  test("first player cannot bet in pre-flop", () => {
    const table = game.getState();
    const secondPlayer = getNextPlayer(table.players, table.dealer, 2);

    game.dispatch(placeBet({ amount: 100, playerId: secondPlayer.id }));

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bets.length).toEqual(2);
  });

  test("after placing a bet there are three bets", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    );

    game.dispatch(placeBet({ amount: 100, playerId: currentPlayer!.id }));

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bets.length).toEqual(3);
  });

  test("after raising the last action is raise", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    );

    game.dispatch(placeBet({ amount: 100, playerId: currentPlayer!.id }));

    const tableAfterBet = game.getState();

    expect(
      tableAfterBet.currentRound.lastPlayerActions.find(
        ({ playerId }) => playerId === currentPlayer!.id
      )
    ).toEqual({
      actionType: PlayerActionType.Raise,
      playerId: currentPlayer!.id,
      betAmount: 100,
    });
  });

  test("after calling the last action is call", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    );

    game.dispatch(
      placeBet({ amount: table.smallBlind * 2, playerId: currentPlayer!.id })
    );

    const tableAfterBet = game.getState();

    expect(
      tableAfterBet.currentRound.lastPlayerActions.find(
        ({ playerId }) => playerId === currentPlayer!.id
      )
    ).toEqual({
      actionType: PlayerActionType.Call,
      playerId: currentPlayer!.id,
      betAmount: table.smallBlind * 2,
    });
  });

  test("must call the big blind", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    );

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 2 - 1,
        playerId: currentPlayer!.id,
      })
    );

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bets.length).toEqual(2);
  });

  test("cannot raise by less than the big blind", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    );

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 4 - 1,
        playerId: currentPlayer!.id,
      })
    );

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bets.length).toEqual(2);
  });

  test("when all players call the dealers raise, the flop is revealed", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    )!;
    const smallBlind = getNextPlayer(table.players, currentPlayer.id);
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
    expect(tableAfterBet.board).toEqual(tableAfterBet.flop);
    expect(tableAfterBet.currentRound.bets.length).toEqual(0);
    expect(tableAfterBet.currentRound.pots.length).toEqual(1);
    expect(tableAfterBet.currentRound.pots[0]!.amount).toEqual(
      table.smallBlind * 12
    );
  });

  test("when all players call the big blind, the big blind player can still raise", () => {
    const table = game.getState();
    const currentPlayer = table.players.find(
      ({ id }) => id === table.currentRound.currentPlayer
    )!;
    const smallBlind = getNextPlayer(table.players, currentPlayer.id);
    const bigBlind = getNextPlayer(table.players, smallBlind.id);

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 2,
        playerId: currentPlayer.id,
      })
    );

    game.dispatch(
      placeBet({
        amount: table.smallBlind * 1,
        playerId: smallBlind.id,
      })
    );

    const tableAfterBet = game.getState();

    expect(tableAfterBet.currentRound.bettingRound).toEqual(
      BettingRoundType.PreFlop
    );
    expect(tableAfterBet.board).toEqual([]);
    expect(tableAfterBet.currentRound.currentPlayer).toEqual(bigBlind.id);
  });
});
