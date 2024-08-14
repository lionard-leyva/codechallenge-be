
class DepositController {
    constructor(depositUseCase) {
        this.depositUseCase = depositUseCase;
    }

    async deposit(request, response) {
        const { accountId, amount } = request.body;

        if (!accountId) {
            return response.status(400).json({ error: 'Account ID is required' });
        }
        if (amount === undefined) {
            return response.status(400).json({ error: 'Amount is required' });
        }

        try {
            const account = await this.depositUseCase.execute(accountId, Number(amount));
            return response.status(200).json({
                message: 'Deposit successful',
                balance: account.balance
            });
        } catch (error) {
            return response.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = DepositController;