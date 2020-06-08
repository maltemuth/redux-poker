import { PokerTableReducer } from "../PokerTableReducer";
import { SetSittingOutNextRoundAction } from "../actions";

const setSittingOutNextRound: PokerTableReducer<SetSittingOutNextRoundAction> = (
  table,
  { id }
) => {
  return {
    ...table,
    players: table.players.map((player) => {
      if (id === player.id) {
        return {
          ...player,
          wantsToSitOut: true,
        };
      }

      return player;
    }),
  };
};

export default setSittingOutNextRound;
