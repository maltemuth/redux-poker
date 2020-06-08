import {
  PokerTableState,
  BettingRoundType,
} from "../../../src/PokerTableState";
import start from "../../../src/model/bettingRound/start";
import createPokerTable from "../../../src/model/createPokerTable";
import player from "../../lib/player";
import getNextPlayer from "../../../src/model/player/getNextPlayer";

const tableWithTwoPlayers: PokerTableState = createPokerTable();
tableWithTwoPlayers.players = [
  { ...player(1), chips: 3000 },
  { ...player(2), chips: 3000 },
];
tableWithTwoPlayers.smallBlind = 25;

describe("starting a betting round", () => {
  test("after starting a pre-flop betting round there are two bets", () => {
    const table: PokerTableState = JSON.parse(
      JSON.stringify(tableWithTwoPlayers)
    );

    table.currentRound.bettingRound = BettingRoundType.PreFlop;

    const afterStarting = start(table);

    expect(afterStarting.currentRound.bets.length).toBe(2);
    expect(afterStarting.currentRound.bets.map((bet) => bet.amount)).toEqual(
      expect.arrayContaining([table.smallBlind, table.smallBlind * 2])
    );
  });

  test("after starting a flop betting round there are no bets", () => {
    const table: PokerTableState = JSON.parse(
      JSON.stringify(tableWithTwoPlayers)
    );

    table.currentRound.bettingRound = BettingRoundType.Flop;

    const afterStarting = start(table);

    expect(afterStarting.currentRound.bets.length).toBe(0);
  });

  test("after starting a pre-flop betting round with two players the current player is the small blind player", () => {
    const table: PokerTableState = JSON.parse(
      JSON.stringify(tableWithTwoPlayers)
    );

    table.currentRound.bettingRound = BettingRoundType.PreFlop;
    const smallBlindPlayer = getNextPlayer(table.players, table.dealer);

    const afterStarting = start(table);

    expect(afterStarting.currentRound.currentPlayer).toBe(smallBlindPlayer.id);
  });
});
