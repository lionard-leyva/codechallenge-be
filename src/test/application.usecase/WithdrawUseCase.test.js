const WithdrawUseCase = require('../../app/application/useCases/WithdrawUseCase');
describe('WithdrawUseCase', () => {
    let withdrawUseCase;
    let mockAccountRepository;

    beforeEach(() => {
        mockAccountRepository = {
            getAccountById: jest.fn(),
            save: jest.fn()
        };
        withdrawUseCase = new WithdrawUseCase(mockAccountRepository);
    });

    it('should withdraw money from an existing account', async () => {
        const mockAccount = {
            id: '123',
            balance: 1000,
            withdraw: jest.fn()
        };
        mockAccountRepository.getAccountById.mockResolvedValue(mockAccount);

        await withdrawUseCase.execute('123', 500);

        expect(mockAccount.withdraw).toHaveBeenCalledWith(500);
        expect(mockAccountRepository.save).toHaveBeenCalledWith(mockAccount);
    });
    it('should propagate "Withdrawal amount must be positive" error from the account entity', async () => {
        const mockAccount = {
            id: '123',
            balance: 1000,
            withdraw: jest.fn().mockImplementation(() => {
                throw new Error('Withdrawal amount must be positive');
            })
        };
        mockAccountRepository.getAccountById.mockResolvedValue(mockAccount);

        await expect(withdrawUseCase.execute('123', -500)).rejects.toThrow('Withdrawal amount must be positive');
        
    });

    it('should propagate "Insufficient funds" error from Account entity', async () => {
        const mockAccount = {
            id: '123',
            balance: 100,
            withdraw: jest.fn().mockImplementation(() => {
                throw new Error('Insufficient funds');
            })
        };
        mockAccountRepository.getAccountById.mockResolvedValue(mockAccount);

        await expect(withdrawUseCase.execute('123', 500)).rejects.toThrow('Insufficient funds');
    });
});