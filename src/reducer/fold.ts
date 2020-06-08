import { PokerTableReducer } from "../PokerTableReducer";
import { FoldAction } from "../actions";
import { PlayerActionType } from "../PokerTableState";
import advance from "../model/bettingRound/advance";

const fold: PokerTableReducer<FoldAction> = (table, { id }) => {
  if (table.currentRound.currentPlayer !== id) return table;

  const newActions = table.currentRound.lastPlayerActions
    .filter((playerAction) => playerAction.playerId !== id)
    .concat([
      {
        actionType: PlayerActionType.Fold,
        playerId: id,
        betAmount: 0,
      },
    ]);

  const tableWithFold = {
    ...table,
    currentRound: {
      ...table.currentRound,
      lastPlayerActions: newActions,
    },
  };

  return advance(tableWithFold);
};

export default fold;
