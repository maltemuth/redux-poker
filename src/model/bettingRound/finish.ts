import {
  PokerTableState,
  BettingRoundType,
  Bet,
  Pot,
  PlayerActionType,
} from "../../PokerTableState";
import { Card } from "@malte.muth/poker-hands/dist/src/model/card/Card";
import finishTurn from "../turn/finish";
import advance from "./advance";

const finish = (table: PokerTableState): PokerTableState => {
  const currentBettingRound = table.currentRound.bettingRound;
  let nextBettingRound: BettingRoundType | null = null;
  let newBoard: Card[];

  // collect bets into pots

  const betsOfFoldedPlayers = table.currentRound.bets.filter((bet) => {
    const lastAction = table.currentRound.lastPlayerActions.find(
      ({ playerId }) => playerId === bet.playerId
    );

    return lastAction && lastAction.actionType === PlayerActionType.Fold;
  });

  const otherBets = table.currentRound.bets.filter((bet) => {
    const lastAction = table.currentRound.lastPlayerActions.find(
      ({ playerId }) => playerId === bet.playerId
    );

    return !lastAction || lastAction.actionType !== PlayerActionType.Fold;
  });

  const sortedBets = otherBets.sort((a, b) => a.amount - b.amount);

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

  // newPots might be an empty array if no bets were placed this round
  // which happens in showdowns or when all players but one fold
  const newMainPot: Pot = table.currentRound.pots[0]
    ? {
        amount: (newPots[0]?.amount || 0) + table.currentRound.pots[0].amount,
        playerIds:
          newPots[0]?.playerIds || table.currentRound.pots[0].playerIds,
      }
    : newPots[0];

  newMainPot.amount += betsOfFoldedPlayers.reduce(
    (sum, { amount }) => sum + amount,
    0
  );

  const [_, ...remainingNewPots] = newPots;

  const [__, ...remainingOldPots] = table.currentRound.pots;

  const updatedPots = [
    ...remainingNewPots.reverse(),
    newMainPot,
    ...remainingOldPots,
  ].filter((_) => _);

  const tableWithUpdatedPots: PokerTableState = {
    ...table,
    currentRound: {
      ...table.currentRound,
      bets: [],
      pots: updatedPots,
    },
  };

  // @todo go through all pots and remove players that have folded

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
      lastPlayerActions: table.currentRound.lastPlayerActions.filter(
        ({ actionType }) =>
          actionType === PlayerActionType.Fold ||
          actionType === PlayerActionType.AllIn
      ),
      currentPlayer: table.dealer,
      lastPlayerToRaise: "",
      amountNeededForCalling: 0,
    },
    board: newBoard!,
  };

  return advance(tableBeforeNextRound);
};

export default finish;
