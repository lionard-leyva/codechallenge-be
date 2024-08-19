const DepositUseCase = require('../../../src/app/application/useCases/DepositUseCase');
const InMemoryAccountRepository = require('../../../src/app/infraestructure/repository/InMemoryAccountRepository.js');

describe('DepositUseCase Integration', () => {
    let depositUseCase;
    let accountRepository;

    beforeEach(() => {
        accountRepository = new InMemoryAccountRepository();
        depositUseCase = new DepositUseCase(accountRepository);
    });

    it('should deposit money into an account', async () => {
        await accountRepository.createAccount('123', 1000);
        await depositUseCase.execute('123', 500);
        const account = await accountRepository.getAccountById('123');
        expect(account.balance).toBe(1500);
    });

    it('should throw an error if account does not exist', async () => {
        await expect(depositUseCase.execute('111', 500))
            .rejects.toThrow('Account not found');
    });

    it('should not allow deposit of negative amount', async () => {
        await accountRepository.createAccount('123', 1000);

        await expect(depositUseCase.execute('123', -500))
            .rejects.toThrow('Deposit amount must be positive');
    });
    it('should not allow deposits exceeding daily limit', async () => {
        await accountRepository.createAccount('123', 1000);
        const firstDepositResult = await depositUseCase.execute('123', 4000);
        console.log('After first deposit:', JSON.stringify(firstDepositResult));
        await expect(depositUseCase.execute('123', 1001)).rejects.toThrow('Daily deposit limit exceeded');
        const finalAccount = await accountRepository.getAccountById('123');
        console.log('Final account state:', JSON.stringify(finalAccount));
        expect(finalAccount.balance).toBe(5000);
        expect(finalAccount.dailyDeposits).toBe(4000);
    });
    it('should not allow deposits exceeding daily limit', async () => {
        await accountRepository.createAccount('123', 1000);
        await depositUseCase.execute('123', 4000);
        await expect(depositUseCase.execute('123', 1001))
            .rejects.toThrow('Daily deposit limit exceeded');
    });
});