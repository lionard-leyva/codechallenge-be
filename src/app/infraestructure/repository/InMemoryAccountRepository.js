const Account =  require('../../domain/Account');
class InMemoryAccountRepository {
    constructor() {
        this.accounts = new Map();
    }

    async getAccountById(id) {
        const accountData = this.accounts.get(id);
        if (!accountData) return null;
        return new Account(accountData.id, accountData.balance);
    }

    async save(account) {
        this.accounts.set(account.id, account);
    }

    async createAccount(id, initialBalance = 0) {
        const account = { id, balance: initialBalance };
        await this.save(account);
        return account;
    }
}

module.exports = InMemoryAccountRepository;