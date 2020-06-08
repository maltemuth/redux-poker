import { PokerTableState } from "./PokerTableState";

export type PokerTableReducer<ActionType> = (
  table: PokerTableState,
  action: ActionType
) => PokerTableState;
