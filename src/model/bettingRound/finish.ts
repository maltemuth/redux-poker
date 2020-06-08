import {
  PokerTableState,
  BettingRoundType,
  Bet,
  Pot,
} from "../../PokerTableState";
import { Card } from "@malte.muth/poker-hands/dist/src/model/card/Card";
import finishTurn from "../turn/finish";
import start from "./start";

const finish = (table: PokerTableState): PokerTableState => {
  const currentBettingRound = table.currentRound.bettingRound;
  let nextBettingRound: BettingRoundType | null = null;
  let newBoard: Card[];

  // collect bets into pots

  const sortedBets = table.currentRound.bets.sort(
    (a, b) => a.amount - b.amount
  );

  const betsByAmount = sortedBets.reduce((map, bet) => {
    map[bet.amount.toString()] = map[bet.amount.toString()] || [];
    map[bet.amount.toString()].push(bet);
    return map;
  }, {} as { [amount: string]: Bet[] });

  const uniqueAmounts = Object.keys(betsByAmount).map((a) => parseInt(a, 10));

  const betsWithAtLeast = uniqueAmounts.reduce((map, amount) => {
    return {
      ...map,
      [amount]: table.currentRound.bets.filter((bet) => bet.amount >= amount),
    };
  }, {} as { [amount: string]: Bet[] });

  // create side pots
  const newPots: Pot[] = [];
  let deductedAmount = 0;
  Object.keys(betsByAmount).forEach((amount) => {
    const betsWithThatAmount = betsWithAtLeast[amount];
    const newPot = betsWithThatAmount.reduce(
      (pot, bet) => {
        pot.amount += bet.amount - deductedAmount;
        pot.playerIds.push(bet.playerId);
        return pot;
      },
      {
        amount: 0,
        playerIds: [],
      } as Pot
    );
    newPots.push(newPot);
    deductedAmount += parseInt(amount, 10);
  });

  // merge the last pot with the first new one

  const newMainPot: Pot = table.currentRound.pots[0]
    ? {
        amount: newPots[0].amount + table.currentRound.pots[0].amount,
        playerIds: newPots[0].playerIds,
      }
    : newPots[0];
  const [_, ...remainingNewPots] = newPots;

  const [__, ...remainingOldPots] = table.currentRound.pots;

  const updatedPots = [
    ...remainingNewPots.reverse(),
    newMainPot,
    ...remainingOldPots,
  ];

  const playersWithChipsRemoved = table.players.map((player) => {
    const bet = table.currentRound.bets.find(
      (bet) => bet.playerId === player.id
    );
    if (!bet) return player;

    return {
      ...player,
      chips: player.chips - bet.amount,
    };
  });

  const tableWithUpdatedPots = {
    ...table,
    players: playersWithChipsRemoved,
    currentRound: {
      ...table.currentRound,
      bets: [],
      pots: updatedPots,
    },
  };

  // go through all pots and remove players that have folded

  if (currentBettingRound === BettingRoundType.River) {
    return finishTurn(table);
  }

  if (currentBettingRound === BettingRoundType.PreFlop) {
    nextBettingRound = BettingRoundType.Flop;
    newBoard = [...table.board, ...table.flop];
  }
  if (currentBettingRound === BettingRoundType.Flop) {
    nextBettingRound = BettingRoundType.Turn;
    newBoard = [...table.board, ...table.turn];
  }
  if (currentBettingRound === BettingRoundType.Turn) {
    nextBettingRound = BettingRoundType.River;
    newBoard = [...table.board, ...table.river];
  }

  const tableBeforeNextRound: PokerTableState = {
    ...tableWithUpdatedPots,
    currentRound: {
      ...tableWithUpdatedPots.currentRound,
      bettingRound: nextBettingRound!,
    },
    board: newBoard!,
  };

  return start(tableBeforeNextRound);
};

export default finish;
