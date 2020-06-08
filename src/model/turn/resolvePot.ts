import { PokerTableState, Pot, Player } from "../../PokerTableState";
import { getBestHand, isBetterThan } from "@malte.muth/poker-hands/dist/src";

const resolvePot = (table: PokerTableState, pot: Pot): PokerTableState => {
  const players = pot.playerIds.map((id) =>
    table.players.find((player) => player.id === id)
  );

  let bestPlayer = players[0];
  let bestHand = getBestHand([...players[0]!.currentCards, ...table.board]);

  players.forEach((player) => {
    const cards = [...player!.currentCards, ...table.board];
    const candidate = getBestHand(cards);

    if (isBetterThan(candidate!, bestHand!)) {
      bestHand = candidate;
      bestPlayer = player;
    }
  });

  const updatedPlayer: Player = {
    ...bestPlayer!,
    chips: bestPlayer!.chips + pot.amount,
  };

  const updatedPlayers = table.players.map((player) => {
    if (player.id === bestPlayer!.id) return updatedPlayer;

    return player;
  });

  return {
    ...table,
    players: updatedPlayers,
  };
};

export default resolvePot;
