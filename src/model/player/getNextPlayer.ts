import { PlayerId, Player } from "../../PokerTableState";

const getNextPlayer = (players: Player[], current: PlayerId): Player => {
  const currentIndex = players.findIndex(({ id }) => current === id);

  if (null === currentIndex)
    throw new Error(
      `Tried to get a next player for id ${current}, but this id is not in the list of given players`
    );
  const playersAfter = players.filter((_, index) => index > currentIndex);

  if (playersAfter.length > 0) return playersAfter[0];

  const playersBefore = players.filter((_, index) => index < currentIndex);

  if (playersBefore.length > 0) return playersBefore[0];

  return players[currentIndex];
};

export default getNextPlayer;
