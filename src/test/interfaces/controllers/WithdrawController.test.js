const WithdrawController = require('../../../app/interfaces/controllers/WithdrawController');

describe('WithdrawControllerTest', () => {
    let withdrawController;
    let mockWithdrawUseCase;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockWithdrawUseCase = {
            execute: jest.fn()
        };
        withdrawController = new WithdrawController(mockWithdrawUseCase);
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
    it('should return 200 and success message on successful withdrawal', async () => {
        const mockAccount = {id: '123', balance: 900};
        mockWithdrawUseCase.execute.mockResolvedValue(mockAccount);
        await withdrawController.withdraw(mockRequest, mockResponse);
        expect(mockWithdrawUseCase.execute).toHaveBeenCalledWith('123', 100);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Withdrawal successful',
            balance: 900
        });
    });

    it('should return 400 if accountId is missing', async () => {
        mockRequest.body = {amount: 100};
        await withdrawController.withdraw(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Account ID is required'
        });
    });

    it('should return 400 if amount is missing', async () => {
        mockRequest.body = {accountId: '123'};
        await withdrawController.withdraw(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Amount is required'
        });
    });

    it('should return 400 and error message when withdrawal fails due to insufficient funds', async () => {
        mockRequest.body = {accountId: '123', amount: 1000};
        mockWithdrawUseCase.execute.mockRejectedValue(new Error('Insufficient funds'));
        await withdrawController.withdraw(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Insufficient funds'
        });
    });
});