import { PokerTableState, Spectator } from "../../PokerTableState";
import isValidSpectator from "./isValidSpectator";

const isValidNewSpectator = (
  table: PokerTableState,
  spectator: Spectator
): boolean => {
  if (!isValidSpectator) return false;

  if (table.spectators.find(({ id }) => id === spectator.id)) return false;
  if (table.spectators.find(({ name }) => name === spectator.name))
    return false;
  if (table.players.find(({ name }) => name === spectator.name)) return false;

  return true;
};

export default isValidNewSpectator;
