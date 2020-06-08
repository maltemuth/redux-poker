import { PokerTableReducer } from "../PokerTableReducer";
import { SetPlayerUnreadyAction } from "../actions";
import hasStarted from "../model/table/hasStarted";

const setPlayerUnready: PokerTableReducer<SetPlayerUnreadyAction> = (
  table,
  { id }
) => {
  if (hasStarted(table)) return table;

  return {
    ...table,
    players: table.players.map((player) => {
      if (id === player.id) {
        return {
          ...player,
          isReady: false,
        };
      }

      return player;
    }),
  };
};

export default setPlayerUnready;
