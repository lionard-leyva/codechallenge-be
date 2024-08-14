class TransferUseCase {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(fromAccountId, toAccountId, amount) {
        const fromAccount = await this.accountRepository.getAccountById(fromAccountId);
        if (!fromAccount) {
            throw new Error('Source account not found');
        }

        const toAccount = await this.accountRepository.getAccountById(toAccountId);
        if (!toAccount) {
            throw new Error('Destination account not found');
        }

        try {
            fromAccount.transfer(amount, toAccount);
            await this.accountRepository.save(fromAccount);
            await this.accountRepository.save(toAccount);
            return { fromAccount, toAccount };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = TransferUseCase;