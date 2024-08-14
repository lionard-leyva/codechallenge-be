const TransferController = require("../../../app/interfaces/controllers/TransferController");

describe('TransferController', () => {
    let transferController;
    let mockTransferUseCase;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        mockTransferUseCase = {
            execute: jest.fn()
        };
        transferController = new TransferController(mockTransferUseCase);
        mockRequest = {
            body: {
                fromAccountId: '123',
                toAccountId: '456',
                amount: 100
            }
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 200 and success message on successful transfer', async () => {
        const mockResult = {
            fromAccount: {id: '123', balance: 900},
            toAccount: {id: '456', balance: 1100}
        };
        mockTransferUseCase.execute.mockResolvedValue(mockResult);

        await transferController.transfer(mockRequest, mockResponse);

        expect(mockTransferUseCase.execute).toHaveBeenCalledWith('123', '456', 100);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Transfer successful',
            fromBalance: 900,
            toBalance: 1100
        });
    });

    it('should return 400 if fromAccountId is missing', async () => {
        mockRequest.body = {toAccountId: '456', amount: 100};
        await transferController.transfer(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'From Account ID is required'
        });
    });

    it('should return 400 if toAccountId is missing', async () => {
        mockRequest.body = {fromAccountId: '123', amount: 100};
        await transferController.transfer(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'To Account ID is required'
        });
    });

    it('should return 400 if amount is missing', async () => {
        mockRequest.body = {fromAccountId: '123', toAccountId: '456'};
        await transferController.transfer(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Amount is required'
        });
    });

    it('should return 400 and error message when transfer fails', async () => {
        mockTransferUseCase.execute.mockRejectedValue(new Error('Insufficient funds'));
        await transferController.transfer(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Insufficient funds'
        });
    });
});