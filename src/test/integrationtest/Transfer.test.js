const TransferUseCase = require('../../../src/app/application/useCases/TransferUseCase.js');
const InMemoryAccountRepository = require('../../../src/app/infraestructure/repository/InMemoryAccountRepository.js');

describe('TransferUseCase Integration', () => {
    let transferUseCase;
    let accountRepository;

    beforeEach(() => {
        accountRepository = new InMemoryAccountRepository();
        transferUseCase = new TransferUseCase(accountRepository);
    });

    it('should transfer money between accounts', async () => {
        await accountRepository.createAccount('123', 1000);
        await accountRepository.createAccount('456', 500);
        await transferUseCase.execute('123', '456', 300);
        const fromAccount = await accountRepository.getAccountById('123');
        const toAccount = await accountRepository.getAccountById('456');
        expect(fromAccount.balance).toBe(700);
        expect(toAccount.balance).toBe(800);
    });
    it('should not allow transfer if it would result in negative balance', async () => {
        await accountRepository.createAccount('123', 100);
        await accountRepository.createAccount('456', 500);

        await expect(transferUseCase.execute('123', '456', 101))
            .rejects.toThrow('Insufficient funds for transfer');

        const fromAccount = await accountRepository.getAccountById('123');
        const toAccount = await accountRepository.getAccountById('456');

        expect(fromAccount.balance).toBe(100);
        expect(toAccount.balance).toBe(500);
    });

    it('should throw an error if source account does not exist', async () => {
        await accountRepository.createAccount('456', 500);

        await expect(transferUseCase.execute('123', '456', 100))
            .rejects.toThrow('Source account not found');
    });

    it('should throw an error if destination account does not exist', async () => {
        await accountRepository.createAccount('123', 1000);

        await expect(transferUseCase.execute('123', '456', 100))
            .rejects.toThrow('Destination account not found');
    });
});