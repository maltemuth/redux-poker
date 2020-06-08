import { PokerTableState, Player } from "../PokerTableState";
import { SeatSpectatorAction } from "../actions";
import isValidNewPlayer from "../model/player/isValidNewPlayer";

const STARTING_CHIPS = 3000;

const seatSpectator = (
  table: PokerTableState,
  { id, seat }: SeatSpectatorAction
): PokerTableState => {
  const candidate = table.spectators.find((spectator) => spectator.id === id);

  if (!candidate) return table;

  const newPlayer: Player = {
    ...candidate,
    seat,
    chips: STARTING_CHIPS,
    currentCards: [],
    isSittingOut: false,
    isReady: false,
    revealedCards: [],
    wantsToShow: [],
    wantsToSitOut: false,
  };

  if (!isValidNewPlayer(table, newPlayer)) return table;

  return {
    ...table,
    players: [...table.players, newPlayer],
    spectators: table.spectators.filter((spectator) => spectator.id !== id),
  };
};

export default seatSpectator;
