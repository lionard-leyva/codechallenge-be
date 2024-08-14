class Account {
    constructor(id, initialBalance = 0) {
        this.id = id;
        this.balance = initialBalance;
        this.dailyDeposits = 0;
    }

    deposit(amount) {
        if (amount <= 0) {
            throw new Error('Deposit amount must be positive');
        }
        if (this.dailyDeposits + amount > 5000) {
            throw new Error('Daily deposit limit exceeded');
        }
        this.balance += amount;
        this.dailyDeposits += amount;
    }

    resetDailyDeposits() {
        this.dailyDeposits = 0;
    }

    withdraw(amount) {
        if (amount <= 0) {
            throw new Error('Withdrawal amount must be positive');
        }
        if (this.balance - amount < -200) {
            throw new Error('Insufficient funds');
        }
        this.balance -= amount;
    }

    transfer(amount, targetAccount) {
        if (amount <= 0) {
            throw new Error('Transfer amount must be positive');
        }
        if (this.balance < amount) {
            throw new Error('Insufficient funds for transfer');
        }
        this.balance -= amount;
        targetAccount.deposit(amount);

    }

    getBalance() {
        return this.balance;
    }
}
module.exports = Account;