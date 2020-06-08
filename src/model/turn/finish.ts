import { PokerTableState } from "../../PokerTableState";
import start from "./start";
import resolvePot from "./resolvePot";

const finish = (table: PokerTableState): PokerTableState => {
  // resolve the pots, first, to last

  const tableWithAllPotsResolved = table.currentRound.pots.reduce(
    (resolved, pot) => resolvePot(resolved, pot),
    table
  );

  return start(tableWithAllPotsResolved);
};

export default finish;
