import Transaction from '../models/Transaction';

interface Result {
  transactions: Transaction[];
  balance: Balance;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };
  }

  public all(): Result {
    const result = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };

    return result;
  }

  public getBalance(): Balance {
    const reducer = (total: number, currentValue: Transaction) =>
      total + currentValue.value;

    const incomeTransactions: Transaction[] = this.transactions.filter(
      transaction => transaction.type === 'income',
    );

    const income = incomeTransactions.reduce(reducer, 0);

    const outcomeTransactions: Transaction[] = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const outcome = outcomeTransactions.reduce(reducer, 0);
    const total = income - outcome;

    this.balance = {
      income,
      outcome,
      total,
    };
    return this.balance;
  }

  public create({ title, type, value }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
