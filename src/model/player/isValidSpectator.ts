import { Spectator } from "../../PokerTableState";

const isValidSpectator = (spectator: Spectator): boolean => {
  if (typeof spectator.name !== "string" || spectator.name.length < 1)
    return false;

  if (typeof spectator.id !== "string" || spectator.id.length < 1) return false;

  return true;
};

export default isValidSpectator;
