import { PokerTableState } from "../../PokerTableState";

const seatIsTaken = (
  { players }: PokerTableState,
  requestedSeat: number
): boolean => players.find(({ seat }) => seat === requestedSeat) !== null;

export default seatIsTaken;
