const TranferUseCaseTest = require('../../app/application/useCases/TransferUseCase');

describe('TransferUseCase', () => {
    let transferUseCase;
    let mockAccountRepository;

    beforeEach(() => {
        mockAccountRepository = {
            getAccountById: jest.fn(),
            save: jest.fn()
        };
        transferUseCase = new TranferUseCaseTest(mockAccountRepository);
    });

    it('should transfer money between two existing account', async () => {
        const mockFromAccount = {
            id: '123',
            balance: 1000,
            transfer: jest.fn()
        };
        const mockToAccount = {
            id: '456',
            balance: 1000
        };
        mockAccountRepository.getAccountById.mockImplementation((id) => {
            if (id === '123') return Promise.resolve(mockFromAccount);
            if (id === '456') return Promise.resolve(mockToAccount);
        });

        await transferUseCase.execute('123', '456', 300);
        expect(mockFromAccount.transfer).toHaveBeenCalledWith(300, mockToAccount);
        expect(mockAccountRepository.save).toHaveBeenCalledWith(mockFromAccount);
        expect(mockAccountRepository.save).toHaveBeenCalledWith(mockToAccount);
    });

    it('should throw an error if source account is not found', async () => {
        mockAccountRepository.getAccountById.mockImplementation((id) => {
            if (id === '123') return Promise.resolve(null);
            if (id === '456') return Promise.resolve({});
        });

        await expect(transferUseCase.execute('123', '456', 300)).rejects.toThrow('Source account not found');
    });

    it('should throw an error if destination account is not found', async () => {
        mockAccountRepository.getAccountById.mockImplementation((id) => {
            if (id === '123') return Promise.resolve({});
            if (id === '456') return Promise.resolve(null);
        });

        await expect(transferUseCase.execute('123', '456', 300)).rejects.toThrow('Destination account not found');
    });

    it('should propagate insufficient funds error from Account entity', async () => {
        const mockFromAccount = {
            id: '123',
            balance: 200,
            transfer: jest.fn().mockImplementation(() => {
                throw new Error('Insufficient funds');
            })
        };
        const mockToAccount = {
            id: '456',
            balance: 500
        };
        mockAccountRepository.getAccountById.mockImplementation((id) => {
            if (id === '123') return Promise.resolve(mockFromAccount);
            if (id === '456') return Promise.resolve(mockToAccount);
        });

        await expect(transferUseCase.execute('123', '456', 300)).rejects.toThrow('Insufficient funds');
    });
    it('should propagate error for negative transfer amount', async () => {
        const mockFromAccount = {
            transfer: jest.fn().mockImplementation((amount) => {
                if (amount < 0) {
                    throw new Error('Transfer amount must be positive');
                }
            })
        };
        const mockToAccount = {};
        mockAccountRepository.getAccountById.mockImplementation((id) => {
            if (id === '123') return Promise.resolve(mockFromAccount);
            if (id === '456') return Promise.resolve(mockToAccount);
        });

        await expect(transferUseCase.execute('123', '456', -300)).rejects.toThrow('Transfer amount must be positive');
    });

    it('should propagate error for zero transfer amount', async () => {
        const mockFromAccount = {
            transfer: jest.fn().mockImplementation((amount) => {
                if (amount === 0) {
                    throw new Error('Transfer amount must be positive');
                }
            })
        };
        const mockToAccount = {};
        mockAccountRepository.getAccountById.mockImplementation((id) => {
            if (id === '123') return Promise.resolve(mockFromAccount);
            if (id === '456') return Promise.resolve(mockToAccount);
        });

        await expect(transferUseCase.execute('123', '456', 0)).rejects.toThrow('Transfer amount must be positive');
    });

});