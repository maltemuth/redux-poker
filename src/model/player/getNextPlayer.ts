import { PlayerId, Player } from "../../PokerTableState";

const getNextPlayer = (
  players: Player[],
  current: PlayerId,
  advance = 1
): Player => {
  const currentPlayer = players.find(({ id }) => current === id);

  if (!currentPlayer)
    throw new Error(
      `Tried to get a next player for id ${current}, but this id is not in the list of given players`
    );

  const sortedPlayers = players.sort((a, b) => a.seat - b.seat);
  const playersAfter = sortedPlayers.filter(
    ({ seat }) => seat > currentPlayer.seat
  );

  const playersBefore = sortedPlayers.filter(
    ({ seat }) => seat < currentPlayer.seat
  );

  const nextPlayer = playersAfter[0] || playersBefore[0] || currentPlayer;

  if (advance === 1) return nextPlayer;

  return getNextPlayer(players, nextPlayer.id, advance - 1);
};

export default getNextPlayer;
