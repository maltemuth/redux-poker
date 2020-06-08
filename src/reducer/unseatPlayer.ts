import { UnseatPlayerAction } from "../actions";
import { PokerTableReducer } from "../PokerTableReducer";

const unseatPlayer: PokerTableReducer<UnseatPlayerAction> = (table, { id }) => {
  const movingPlayer = table.players.find((player) => player.id === id);

  if (!movingPlayer) return table;

  const alreadyLeaving = table.leavingPlayers.find((player) => player === id);

  if (!alreadyLeaving) return table;

  return {
    ...table,
    leavingPlayers: [...table.leavingPlayers, id],
  };
};

export default unseatPlayer;
