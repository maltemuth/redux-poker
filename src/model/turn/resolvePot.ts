import { PokerTableState, Pot, Player } from "../../PokerTableState";
import {
  getBestHand,
  isBetterThan,
  hasEqualValue,
} from "@malte.muth/poker-hands/dist/src";

const resolvePot = (table: PokerTableState, pot: Pot): PokerTableState => {
  const players = pot.playerIds
    .map((id) => table.players.find((player) => player.id === id))
    .filter((_) => _);

  const playersSortedByHand = players.sort((a, b) => {
    const aHand = getBestHand([...a!.currentCards, ...table.board]);
    const bHand = getBestHand([...b!.currentCards, ...table.board]);

    if (isBetterThan(aHand!, bHand!)) return +1;
    if (hasEqualValue(aHand!, bHand!)) return 0;
    return -1;
  });

  const firstPlayerWithBestHand = playersSortedByHand[0];
  const firstPlayersHand = getBestHand([
    ...firstPlayerWithBestHand!.currentCards,
    ...table.board,
  ]);

  const playersWithBestHand = players.filter((player) => {
    const playerHand = getBestHand([...player!.currentCards, ...table.board]);
    return hasEqualValue(playerHand!, firstPlayersHand!);
  }) as Player[];

  const bestPlayerIds = playersWithBestHand.map(({ id }) => id);

  const potPayout = Math.floor(pot.amount / playersWithBestHand.length);

  const updatedPlayers = table.players.map((player) => {
    if (bestPlayerIds.includes(player.id)) {
      return {
        ...player,
        chips: player.chips + potPayout,
      };
    }

    return player;
  });

  return {
    ...table,
    players: updatedPlayers,
  };
};

export default resolvePot;
