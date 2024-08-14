const Account = require('../../../src/app/domain.entities/Account');

describe('Account', () => {
    describe('deposit', () => {
        it('should increase the balance when deposit is made', () => {
            const account = new Account('1', 1000);
            account.deposit(500);
            expect(account.balance).toBe(1500);
        });
        it('should not allow deposits above $5000 per day', () => {
            const account = new Account('1', 1000);
            account.deposit(5000);
            expect(() => account.deposit(1001)).toThrow('Daily deposit limit exceeded');
        });
        it('should allow multiple deposits up to $5000 per day', () => {
            const account = new Account('1', 1000);
            account.deposit(2000);
            account.deposit(2000);
            account.deposit(1000);
            expect(account.balance).toBe(6000);
        });
        it('should throw and error when depositing a negative amount', () => {
            const account = new Account('1', 1000);
            expect(() => account.deposit(-500)).toThrow('Deposit amount must be positive');
        });
        it('should reset daily deposit limit after calling resetDailyDeposits', () => {
            const account = new Account('1', 1000);
            account.deposit(5000);
            account.resetDailyDeposits();
            expect(() => account.deposit(5000)).not.toThrow();
            expect(account.balance).toBe(11000);
        });
    });
    describe('withdraw', () => {
        it('should decrease the balance when withdraw is made', () => {
            const account = new Account('1', 1000);
            account.withdraw(500);
            expect(account.balance).toBe(500);
        });

        it('should allow withdrawal up to $200 overdraft', () => {
            const account = new Account('1', 100);
            account.withdraw(300);
            expect(account.getBalance()).toBe(-200);
        });

        it('should throw an error when withdrawing beyond $200 overdraft', () => {
            const account = new Account('1', 100);
            expect(() => account.withdraw(301)).toThrow('Insufficient funds');
        });

        it('should throw an error when withdrawing a negative amount', () => {
            const account = new Account('1', 1000);
            expect(() => account.withdraw(-500)).toThrow('Withdrawal amount must be positive');
        });

        it('should throw an error when withdrawing zero', () => {
            const account = new Account('1', 1000);
            expect(() => account.withdraw(0)).toThrow('Withdrawal amount must be positive');
        });
    });
    describe('transfer', () => {
        it('should decrease the balance of the source account', () => {
            const sourceAccount = new Account('1', 1000);
            const targetAccount = new Account('2', 500);
            sourceAccount.transfer(300, targetAccount);
            expect(sourceAccount.getBalance()).toBe(700);
        });

        it('should increase the balance of the target account', () => {
            const sourceAccount = new Account('1', 1000);
            const targetAccount = new Account('2', 500);
            sourceAccount.transfer(300, targetAccount);
            expect(targetAccount.getBalance()).toBe(800);
        });

        it('should throw an error when transferring more than available balance', () => {
            const sourceAccount = new Account('1', 100);
            const targetAccount = new Account('2', 500);
            expect(() => sourceAccount.transfer(101, targetAccount)).toThrow('Insufficient funds for transfer');
        });

        it('should throw an error when transferring a negative amount', () => {
            const sourceAccount = new Account('1', 1000);
            const targetAccount = new Account('2', 500);
            expect(() => sourceAccount.transfer(-100, targetAccount)).toThrow('Transfer amount must be positive');
        });

        it('should throw an error when transferring zero', () => {
            const sourceAccount = new Account('1', 1000);
            const targetAccount = new Account('2', 500);
            expect(() => sourceAccount.transfer(0, targetAccount)).toThrow('Transfer amount must be positive');
        });

        it('should not allow overdraft in transfers', () => {
            const sourceAccount = new Account('1', 100);
            const targetAccount = new Account('2', 500);
            expect(() => sourceAccount.transfer(101, targetAccount)).toThrow('Insufficient funds for transfer');
        });
    });
});

