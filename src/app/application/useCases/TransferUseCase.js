class TransferUseCase {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }

    async execute(fromAccountId, toAccountId, amount) {
        const fromAccount = await this.accountRepository.getAccountById(fromAccountId);
        const toAccount = await this.accountRepository.getAccountById(toAccountId);
        console.log('FromAccount:', fromAccount);
        console.log('ToAccount:', toAccount);
        if (!fromAccount) {
            throw new Error('Source account not found');
        }
        if (!toAccount) {
            throw new Error('Destination account not found');
        }
        fromAccount.transfer(amount, toAccount);

        await this.accountRepository.save(fromAccount);
        await this.accountRepository.save(toAccount);
        return {fromAccount, toAccount};
    }
}

module.exports = TransferUseCase;