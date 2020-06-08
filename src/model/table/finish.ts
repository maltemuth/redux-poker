import { PokerTableState } from "../../PokerTableState";

const finish = (table: PokerTableState): PokerTableState => {
  if (table.players.length === 1) {
    const lastPlayer = table.players[0];

    return {
      ...table,
      finishedAt: new Date(),
      retiredPlayers: [
        ...table.retiredPlayers,
        {
          id: lastPlayer.id,
          name: lastPlayer.name,
          retiredAt: new Date(),
          place: 1,
        },
      ],
    };
  }

  return {
    ...table,
    finishedAt: new Date(),
  };
};

export default finish;
