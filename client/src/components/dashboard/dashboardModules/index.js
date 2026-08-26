import CardsBalance from "./cardsBalance/CardsBalance";
import IncomeAndExpenses from "./incomeAndExpenses/IncomeAndExpenses";
import MonthExpenses from "./monthExpenses/MonthExpenses";
import QuickActions from "./quickActions/QuickActions";
import QuickTransferBetweenAcc from "./quickTransferBetweenAcc/QuickTransferBetweenAcc";
import TransactionsHistory from "./transactionsHistory/TransactionsHistory";

export const moduleTypes = {
    cardsBalance: CardsBalance,
    incomeExpenses: IncomeAndExpenses,
    monthExpenses: MonthExpenses,
    quickActions: QuickActions,
    quickTransfer: QuickTransferBetweenAcc,
    transactions: TransactionsHistory,
}