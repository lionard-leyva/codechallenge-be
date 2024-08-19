
const DepositController = require('../../../app/interfaces/controllers/DepositController');
describe('DepositController', () => {
    let depositController;
    let mockDepositUseCase;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockDepositUseCase = {
            execute: jest.fn()
        };
        depositController = new DepositController(mockDepositUseCase);
        mockRequest = {
            body: {
                accountId: '123',
                amount: 100
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 200 and success message on successful deposit', async () => {
        const mockAccount = { id: '123', balance: 1100 };
        mockDepositUseCase.execute.mockResolvedValue(mockAccount);

        await depositController.deposit(mockRequest, mockResponse);

        expect(mockDepositUseCase.execute).toHaveBeenCalledWith('123', 100);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Deposit successful',
            balance: 1100
        });
    });

    it('should return 400 if accountId is missing', async () => {
        mockRequest.body = { amount: 100 };
        await depositController.deposit(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Account ID is required'
        });
    });

    it('should return 400 if amount is missing', async () => {
        mockRequest.body = { accountId: '123' };
        await depositController.deposit(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Amount is required'
        });
    });

    it('should return 400 and error message when deposit fails', async () => {
        mockDepositUseCase.execute.mockRejectedValue(new Error('Daily deposit limit exceeded'));
        await depositController.deposit(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Daily deposit limit exceeded'
        });
    });
});