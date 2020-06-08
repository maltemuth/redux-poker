import { Reducer } from "redux";
import { PokerTableState } from "./PokerTableState";
import {
  PokerAction,
  ADD_SPECTATOR,
  REMOVE_SPECTATOR,
  SEAT_SPECTATOR,
  UNSEAT_PLAYER,
  SET_RETURNING_NEXT_ROUND,
  SET_SITTING_OUT_NEXT_ROUND,
  PLACE_BET,
  FOLD,
  SET_PLAYER_READY,
  SET_PLAYER_UNREADY,
} from "./actions";
import createPokerTable from "./model/createPokerTable";
import addSpectator from "./reducer/addSpectator";
import removeSpectator from "./reducer/removeSpectator";
import seatSpectator from "./reducer/seatSpectator";
import unseatPlayer from "./reducer/unseatPlayer";
import setPlayerReady from "./reducer/setPlayerReady";
import setPlayerUnready from "./reducer/setPlayerUnready";
import setSittingOutNextRound from "./reducer/setSittingOutNextRound";
import setReturningNextRound from "./reducer/setReturningNextRound";

const createPokerTableReducer = (): Reducer<PokerTableState, PokerAction> => (
  state = createPokerTable(),
  action
) => {
  switch (action.type) {
    case ADD_SPECTATOR:
      return addSpectator(state, action);
    case REMOVE_SPECTATOR:
      return removeSpectator(state, action);
    case SEAT_SPECTATOR:
      return seatSpectator(state, action);
    case UNSEAT_PLAYER:
      return unseatPlayer(state, action);
    case SET_PLAYER_READY:
      return setPlayerReady(state, action);
    case SET_PLAYER_UNREADY:
      return setPlayerUnready(state, action);
    case SET_SITTING_OUT_NEXT_ROUND:
      return setSittingOutNextRound(state, action);
    case SET_RETURNING_NEXT_ROUND:
      return setReturningNextRound(state, action);
    case PLACE_BET:
    case FOLD:

    default:
      return state;
  }
};

export default createPokerTableReducer;
