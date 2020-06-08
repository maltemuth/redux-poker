import { createStore, Store } from "redux";
import createPokerTableReducer from "../../../src/createPokerReducer";
import player from "../../lib/player";
import { PokerTableState } from "../../../src/PokerTableState";
import { PokerAction, addSpectator, seatSpectator } from "../../../src/actions";

describe("seating players at a table", () => {
  let game: Store<PokerTableState, PokerAction>;

  const players = [player(1), player(2)];

  beforeEach(() => (game = createStore(createPokerTableReducer())));

  test("adding spectators", () => {
    players.forEach((player) => game.dispatch(addSpectator(player)));

    const table = game.getState();

    expect(table.spectators.length).toEqual(2);
  });

  test("adding players", () => {
    players.forEach((player) => game.dispatch(addSpectator(player)));
    players.forEach((player) => game.dispatch(seatSpectator(player, player)));

    const table = game.getState();

    expect(table.spectators.length).toEqual(0);
    expect(table.players.length).toEqual(2);
  });

  test("cannot take a taken seat", () => {
    const thirdPlayer = player(3);
    thirdPlayer.seat = 1;

    players.forEach((player) => game.dispatch(addSpectator(player)));
    players.forEach((player) => game.dispatch(seatSpectator(player, player)));

    game.dispatch(addSpectator(thirdPlayer));
    game.dispatch(seatSpectator(thirdPlayer, thirdPlayer));

    const table = game.getState();

    expect(table.spectators.length).toEqual(1);
    expect(table.players.length).toEqual(2);
  });

  test("cannot take a taken name", () => {
    const thirdPlayer = player(3);
    thirdPlayer.name = "Player 2";

    players.forEach((player) => game.dispatch(addSpectator(player)));
    players.forEach((player) => game.dispatch(seatSpectator(player, player)));

    game.dispatch(addSpectator(thirdPlayer));
    game.dispatch(seatSpectator(thirdPlayer, thirdPlayer));

    const table = game.getState();

    expect(table.spectators.length).toEqual(0);
    expect(table.players.length).toEqual(2);
  });
});
