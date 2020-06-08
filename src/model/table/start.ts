import { PokerTableState } from "../../PokerTableState";
import startTurn from "../turn/start";

const FIRST_SMALL_BLIND = 10;

const start = (table: PokerTableState): PokerTableState => {
  const dealerIndex = Math.floor(Math.random() * table.players.length - 1);
  const startedTable: PokerTableState = {
    ...table,
    startedAt: new Date(),
    dealer: table.players[dealerIndex].id,
    smallBlind: FIRST_SMALL_BLIND,
  };

  return startTurn(startedTable);
};

export default start;
