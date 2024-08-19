
class WithdrawUseCase {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }

    async execute(accountId, amount) {
        const account = await this.accountRepository.getAccountById(accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        account.withdraw(amount);
        await this.accountRepository.save(account);
        return account;
    }
}

module.exports = WithdrawUseCase;