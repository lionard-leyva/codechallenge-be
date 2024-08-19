class DepositUseCase {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }

    async execute(accountId, amount) {
        const account = await this.accountRepository.getAccountById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }
        console.log('Before deposit:', JSON.stringify(account));
        account.deposit(amount);
        console.log('After deposit:', JSON.stringify(account));
        await this.accountRepository.save(account);
        return account;
    }
}

module.exports = DepositUseCase;