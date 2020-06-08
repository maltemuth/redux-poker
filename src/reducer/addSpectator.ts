import { PokerTableState } from "../PokerTableState";
import { AddSpectatorAction } from "../actions";
import isValidNewSpectator from "../model/player/isValidNewSpectator";

const addSpectator = (
  table: PokerTableState,
  { spectator }: AddSpectatorAction
): PokerTableState => {
  const normalizedSpectator = {
    ...spectator,
    name: spectator.name.trim(),
  };
  if (isValidNewSpectator(table, normalizedSpectator)) {
    return {
      ...table,
      spectators: [...table.spectators, normalizedSpectator],
    };
  }

  return table;
};

export default addSpectator;
