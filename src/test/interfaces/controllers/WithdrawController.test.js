const WithdrawControllerTest = require('../../../app/interfaces/controllers/WithdrawController');

describe('WithdrawControllerTest', () => {
    let withdrawController;
    let mockWithdrawUseCase;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockWithdrawUseCase = {
            execute: jest.fn()
        };
        withdrawController = new WithdrawControllerTest(mockWithdrawUseCase);
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
});

