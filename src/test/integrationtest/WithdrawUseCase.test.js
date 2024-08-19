const WithdrawUseCase = require('../../../src/app/application/useCases/WithdrawUseCase');
const InMemoryAccountRepository = require('../../../src/app/infraestructure/repository/InMemoryAccountRepository.js');

describe('WithdrawUseCase Integration', () => {
    let withdrawUseCase;
    let accountRepository;

    beforeEach(() => {
        accountRepository = new InMemoryAccountRepository();
        withdrawUseCase = new WithdrawUseCase(accountRepository);
    });

    it('should withdraw money from an account', async () => {
        await accountRepository.createAccount('123', 1000);
        await withdrawUseCase.execute('123', 500);
        const account = await accountRepository.getAccountById('123');
        expect(account.balance).toBe(500);
    });

    it('should throw an error if account does not exist', async () => {
        await expect(withdrawUseCase.execute('844', 500))
            .rejects.toThrow('Account not found');
    });

    it('should not allow withdrawal of negative amount', async () => {
        await accountRepository.createAccount('123', 1000);
        await expect(withdrawUseCase.execute('123', -500))
            .rejects.toThrow('Withdrawal amount must be positive');
    });

    it('should allow withdrawal up to $200 overdraft', async () => {
        await accountRepository.createAccount('123', 100);
        await withdrawUseCase.execute('123', 300);
        const account = await accountRepository.getAccountById('123');
        expect(account.balance).toBe(-200);
    });

    it('should not allow withdrawal beyond $200 overdraft', async () => {
        await accountRepository.createAccount('123', 100);
        await expect(withdrawUseCase.execute('123', 301))
            .rejects.toThrow('Insufficient funds');
    });
});