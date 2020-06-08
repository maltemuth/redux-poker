import { createStore, Store } from "redux";
import createPokerTableReducer from "../../../src/createPokerReducer";
import player from "../../lib/player";
import { PokerTableState } from "../../../src/PokerTableState";
import {
  PokerAction,
  addSpectator,
  seatSpectator,
  setPlayerReady,
} from "../../../src/actions";
import hasStarted from "../../../src/model/table/hasStarted";

describe("starting a table", () => {
  let game: Store<PokerTableState, PokerAction>;

  const players = [player(1), player(2), player(3)];

  beforeEach(() => (game = createStore(createPokerTableReducer())));

  test("start when everybody is ready", () => {
    players.forEach((player) => game.dispatch(addSpectator(player)));
    players.forEach((player) =>
      game.dispatch(seatSpectator(player, player.seat))
    );

    players.forEach((player) => game.dispatch(setPlayerReady(player)));

    const table = game.getState();

    expect(hasStarted(table)).toBe(true);
  });

  test("don't start when one player is not ready", () => {
    players.forEach((player) => game.dispatch(addSpectator(player)));
    players.forEach((player) =>
      game.dispatch(seatSpectator(player, player.seat))
    );

    players.forEach(
      (player, index) => index > 0 && game.dispatch(setPlayerReady(player))
    );

    const table = game.getState();

    expect(hasStarted(table)).toBe(false);
  });

  test("doesn't start when there's only one player", () => {
    game.dispatch(addSpectator(players[0]));
    game.dispatch(seatSpectator(players[0], players[0].seat));
    game.dispatch(setPlayerReady(players[0]));

    const table = game.getState();

    expect(hasStarted(table)).toBe(false);
  });
});
