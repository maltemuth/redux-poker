import { PokerTableState, RetiredPlayer, Player } from "../../PokerTableState";
import getNextActivePlayer from "../player/getNextActivePlayer";
import finish from "../table/finish";
import startBettingRound from "../bettingRound/start";

const start = (table: PokerTableState): PokerTableState => {
  const playersNowRetiring = table.players.filter(
    (player) => player.chips <= 0
  );

  const remainingPlayers = table.players.filter((player) => player.chips > 0);
  const placement = remainingPlayers.length + 1;

  const newlyRetiredPlayers: RetiredPlayer[] = playersNowRetiring.map(
    ({ id, name }) => ({
      id,
      name,
      place: placement,
      retiredAt: new Date(),
    })
  );

  // sit out all players who want to sit out
  // and sit in all players who want to sit in
  const newActivePlayers = remainingPlayers.map((player) => {
    player.isSittingOut = player.wantsToSitOut ? true : false;

    return player;
  });

  const tableWithUpdatedPlayers: PokerTableState = {
    ...table,
    retiredPlayers: [...table.retiredPlayers, ...newlyRetiredPlayers],
    players: newActivePlayers,
  };

  if (remainingPlayers.length <= 1) {
    return finish(table);
  }

  let newDealer: Player = getNextActivePlayer(table, table.dealer);

  while (newActivePlayers.findIndex(({ id }) => id === newDealer.id) === -1) {
    newDealer = getNextActivePlayer(table, newDealer.id);
  }

  const updatedTable: PokerTableState = {
    ...tableWithUpdatedPlayers,
    dealer: newDealer.id,
  };

  return startBettingRound(updatedTable);
};

export default start;
