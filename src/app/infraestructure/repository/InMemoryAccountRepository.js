"use strict";

const Account = require('../../domain/Account');

class InMemoryAccountRepository {
    constructor() {
        this.accounts = new Map();
        this.createAccount('123', 1000);
        this.createAccount('456', 500);
    }

    async getAccountById(id) {
        const accountData = this.accounts.get(id);
        if (!accountData) return null;
        const account = new Account(accountData.id, accountData.balance);
        account.dailyDeposits = accountData.dailyDeposits;
        return account;
    }

    async save(account) {
        this.accounts.set(account.id, {
            id: account.id,
            balance: account.balance,
            dailyDeposits: account.dailyDeposits || 0
        });
    }

    async createAccount(id, initialBalance = 0) {
        const account = new Account(id, initialBalance);
        this.accounts.set(id, {
            id: account.id,
            balance: account.balance,
            dailyDeposits: 0
        });
        return account;
    }
}

module.exports = InMemoryAccountRepository;