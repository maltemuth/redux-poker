import { PokerTableState } from "../../PokerTableState";

const hasStarted = (table: PokerTableState): boolean =>
  table.startedAt !== null;

export default hasStarted;
