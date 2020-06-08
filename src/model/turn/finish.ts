import { PokerTableState } from "../../PokerTableState";
import start from "./start";

const finish = (table: PokerTableState): PokerTableState => start(table);

export default finish;
