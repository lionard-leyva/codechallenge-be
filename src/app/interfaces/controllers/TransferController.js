class TransferController {
    constructor(transferUseCase) {
        this.transferUseCase = transferUseCase;
    }

    async transfer(request, response) {
        const { fromAccountId, toAccountId, amount } = request.body;

        if (!fromAccountId) {
            return response.status(400).json({ error: 'From Account ID is required' });
        }
        if (!toAccountId) {
            return response.status(400).json({ error: 'To Account ID is required' });
        }
        if (amount === undefined) {
            return response.status(400).json({ error: 'Amount is required' });
        }

        try {
            const result = await this.transferUseCase.execute(fromAccountId, toAccountId, Number(amount));
            return response.status(200).json({
                message: 'Transfer successful',
                fromBalance: result.fromAccount.balance,
                toBalance: result.toAccount.balance
            });
        } catch (error) {
            return response.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = TransferController;