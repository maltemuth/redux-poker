import { PokerTableReducer } from "../PokerTableReducer";
import { SetPlayerReadyAction } from "../actions";
import hasStarted from "../model/table/hasStarted";
import start from "../model/table/start";

const setPlayerReady: PokerTableReducer<SetPlayerReadyAction> = (
  table,
  { id }
) => {
  if (hasStarted(table)) return table;

  const updatedTable = {
    ...table,
    players: table.players.map((player) => {
      if (id === player.id) {
        return {
          ...player,
          isReady: true,
        };
      }

      return player;
    }),
  };

  if (
    updatedTable.players.filter(({ isReady }) => isReady).length ===
      updatedTable.players.length &&
    updatedTable.players.length > 1
  ) {
    return start(updatedTable);
  }

  return updatedTable;
};

export default setPlayerReady;
