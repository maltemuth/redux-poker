import { Player, PlayerId, Spectator, Bet } from "./PokerTableState";
import { Action } from "redux";
import { Card } from "@malte.muth/poker-hands/dist/src/model/card/Card";

export const ADD_SPECTATOR = "ADD_SPECTATOR";
export const REMOVE_SPECTATOR = "REMOVE_SPECTATOR";

export const SEAT_SPECTATOR = "SEAT_SPECTATOR";
export const UNSEAT_PLAYER = "UNSEAT_PLAYER";

export const SET_PLAYER_READY = "SET_PLAYER_READY";
export const SET_PLAYER_UNREADY = "SET_PLAYER_UNREADY";

export const PLACE_BET = "PLACE_BET";
export const FOLD = "FOLD";

export const SHOW_CARD = "SHOW_CARD";
export const HIDE_CARD = "HIDE_CARD";

export const SET_SITTING_OUT_NEXT_ROUND = "SET_SITTING_OUT_NEXT_ROUND";
export const SET_RETURNING_NEXT_ROUND = "SET_RETURNING_NEXT_ROUND";

export const SET_CARDS = "SET_CARDS";

export interface AddSpectatorAction extends Action {
  type: typeof ADD_SPECTATOR;
  spectator: Spectator;
}

export interface RemoveSpectatorAction extends Action {
  type: typeof REMOVE_SPECTATOR;
  id: PlayerId;
}

export interface SeatSpectatorAction extends Action {
  type: typeof SEAT_SPECTATOR;
  id: PlayerId;
  seat: number;
}

export interface UnseatPlayerAction extends Action {
  type: typeof UNSEAT_PLAYER;
  id: PlayerId;
}

export interface SetPlayerReadyAction extends Action {
  type: typeof SET_PLAYER_READY;
  id: PlayerId;
}

export interface SetPlayerUnreadyAction extends Action {
  type: typeof SET_PLAYER_UNREADY;
  id: PlayerId;
}

export interface PlaceBetAction extends Action {
  type: typeof PLACE_BET;
  bet: Bet;
}

export interface FoldAction extends Action {
  type: typeof FOLD;
  id: PlayerId;
}

export interface ShowCardAction extends Action {
  type: typeof SHOW_CARD;
  id: PlayerId;
  card: Card;
}

export interface HideCardAction extends Action {
  type: typeof HIDE_CARD;
  id: PlayerId;
  card: Card;
}

export interface SetSittingOutNextRoundAction extends Action {
  type: typeof SET_SITTING_OUT_NEXT_ROUND;
  id: PlayerId;
}

export interface SetReturningNextRoundAction extends Action {
  type: typeof SET_RETURNING_NEXT_ROUND;
  id: PlayerId;
}

export interface SetCardsAction extends Action {
  type: typeof SET_CARDS;
  cardsByPlayerId: { [playerId: string]: Card[] };
  flop: Card[];
  turn: Card[];
  river: Card[];
}

export type PlayerInitiatedAction =
  | AddSpectatorAction
  | RemoveSpectatorAction
  | SeatSpectatorAction
  | UnseatPlayerAction
  | SetPlayerReadyAction
  | SetPlayerUnreadyAction
  | PlaceBetAction
  | FoldAction
  | ShowCardAction
  | HideCardAction
  | SetSittingOutNextRoundAction
  | SetReturningNextRoundAction;

export type GameInitiatedAction = SetCardsAction;

export type PokerAction = PlayerInitiatedAction | GameInitiatedAction;

export const addSpectator = (spectator: Spectator): AddSpectatorAction => ({
  type: ADD_SPECTATOR,
  spectator,
});

export const removeSpectator = ({ id }: Spectator): RemoveSpectatorAction => ({
  type: REMOVE_SPECTATOR,
  id,
});

export const seatSpectator = (
  spectator: Spectator,
  seat: number
): SeatSpectatorAction => ({
  type: SEAT_SPECTATOR,
  seat,
  id: spectator.id,
});

export const unseatPlayer = ({ id }: Player): UnseatPlayerAction => ({
  type: UNSEAT_PLAYER,
  id,
});

export const setPlayerReady = ({ id }: Player): SetPlayerReadyAction => ({
  type: SET_PLAYER_READY,
  id,
});

export const setPlayerUnready = ({ id }: Player): SetPlayerUnreadyAction => ({
  type: SET_PLAYER_UNREADY,
  id,
});

export const placeBet = (bet: Bet): PlaceBetAction => ({
  type: PLACE_BET,
  bet,
});

export const fold = ({ id }: Player): FoldAction => ({
  type: FOLD,
  id,
});

export const showCard = ({ id }: Player, card: Card): ShowCardAction => ({
  type: SHOW_CARD,
  id,
  card,
});

export const hideCard = ({ id }: Player, card: Card): HideCardAction => ({
  type: HIDE_CARD,
  id,
  card,
});

export const setSittingOutNextRound = ({
  id,
}: Player): SetSittingOutNextRoundAction => ({
  type: SET_SITTING_OUT_NEXT_ROUND,
  id,
});

export const setReturningNextRound = ({
  id,
}: Player): SetReturningNextRoundAction => ({
  type: SET_RETURNING_NEXT_ROUND,
  id,
});

export const setCards = (
  flop: Card[],
  turn: Card[],
  river: Card[],
  ...players: Player[]
): SetCardsAction => ({
  type: SET_CARDS,
  flop,
  turn,
  river,
  cardsByPlayerId: players.reduce(
    (map, player) => ({
      ...map,
      [player.id]: player.currentCards,
    }),
    {}
  ),
});
