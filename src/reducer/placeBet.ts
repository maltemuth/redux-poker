import { PokerTableReducer } from "../PokerTableReducer";
import { PlaceBetAction } from "../actions";
import canPlaceBet from "../model/player/canPlaceBet";
import placeBetOnTable from "../model/player/placeBet";
import advance from "../model/bettingRound/advance";

const placeBet: PokerTableReducer<PlaceBetAction> = (table, { bet }) => {
  if (bet.playerId !== table.currentRound.currentPlayer) return table;

  const player = table.players.find((player) => player.id === bet.playerId);

  if (!player) return table;

  if (!canPlaceBet(table, player, bet.amount)) return table;

  const betPlaced = placeBetOnTable(table, player, bet.amount);

  const bettingRoundAdvanced = advance(betPlaced);

  return bettingRoundAdvanced;
};

export default placeBet;
