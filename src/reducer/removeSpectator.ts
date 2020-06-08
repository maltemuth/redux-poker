import { PokerTableState } from "../PokerTableState";
import { RemoveSpectatorAction } from "../actions";

const removeSpectator = (
  table: PokerTableState,
  { id }: RemoveSpectatorAction
): PokerTableState => ({
  ...table,
  spectators: table.spectators.filter((spectator) => spectator.id !== id),
});

export default removeSpectator;
