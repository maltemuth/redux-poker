import { PokerTableReducer } from "../PokerTableReducer";
import { SetReturningNextRoundAction } from "../actions";

const setReturningNextRound: PokerTableReducer<SetReturningNextRoundAction> = (
  table,
  { id }
) => {
  return {
    ...table,
    players: table.players.map((player) => {
      if (id === player.id) {
        return {
          ...player,
          wantsToSitOut: false,
        };
      }

      return player;
    }),
  };
};

export default setReturningNextRound;
