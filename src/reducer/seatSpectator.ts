import { PokerTableState, Player } from "../PokerTableState";
import { SeatSpectatorAction } from "../actions";
import isValidNewPlayer from "../model/player/isValidNewPlayer";

const STARTING_CHIPS = 3000;

const seatSpectator = (
  table: PokerTableState,
  { player }: SeatSpectatorAction
): PokerTableState => {
  if (!isValidNewPlayer(table, player)) return table;

  const { id, name, seat } = player;

  const newPlayer: Player = {
    id,
    name,
    seat,
    chips: STARTING_CHIPS,
    currentCards: [],
    isSittingOut: false,
    isReady: false,
    revealedCards: [],
    wantsToShow: [],
    wantsToSitOut: false,
  };

  return {
    ...table,
    players: [...table.players, newPlayer],
    spectators: table.spectators.filter((spectator) => spectator.id !== id),
  };
};

export default seatSpectator;
