const DepositUseCase = require('../../app/application/useCases/DepositUseCase');
describe('DepositUseCase', () => {
    let depositUseCase;
    let mockAccountRepository;


    beforeEach(() => {
        mockAccountRepository = {
            getAccountById: jest.fn(),
            save: jest.fn()
        };
        depositUseCase = new DepositUseCase(mockAccountRepository);
    });

    it('should deposit money into an existing account', async () => {
        const mockAccount = {
            id: '123',
            balance: 1000,
            deposit: jest.fn()
        };
        mockAccountRepository.getAccountById.mockResolvedValue(mockAccount);
        await depositUseCase.execute('123', 500);
        expect(mockAccount.deposit).toHaveBeenCalledWith(500);
        expect(mockAccountRepository.save).toHaveBeenCalledWith(mockAccount);
    });

    it('should throw an error when account does not exist', async () => {
        mockAccountRepository.getAccountById.mockResolvedValue(null);
        const depositUseCase = new DepositUseCase(mockAccountRepository);
        await expect(depositUseCase.execute('123', 500)).rejects.toThrow('Account not found');
    });
    it('should propagate errors from the account entity', async () => {
        const mockAccount = {
            id: '123',
            balance: 1000,
            deposit: jest.fn().mockImplementation(() => {
                throw new Error('Daily deposit limit exceeded');
            })
        };
        mockAccountRepository.getAccountById.mockResolvedValue(mockAccount);
        await expect(depositUseCase.execute('123', 5001)).rejects.toThrow('Daily deposit limit exceeded');
    });
});

