class WithdrawController {
    constructor(withdrawUseCase) {
        this.withdrawUseCase = withdrawUseCase;
    }

    async withdraw(request, response) {
        const {accountId, amount} = request.body;
        if (!accountId) {
            return response.status(400).json({message: 'Account ID is required'});
        }
        if (amount === undefined) {
            return response.status(400).json({message: 'Amount is required'});
        }
        try {
            const account = await this.withdrawUseCase.execute(accountId, amount);
            return response.status(200).json({
                message: 'Withdrawal successful', balance: account.balance
            });
        } catch (error) {
            res.status(400).json({
                error: error.message
            });
        }
    }
}

module.exports = WithdrawController;