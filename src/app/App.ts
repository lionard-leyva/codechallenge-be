
import express, {Express, Request, Response} from "express";
import {Server} from "http";
import InMemoryAccountRepository from "./infraestructure/repository/InMemoryAccountRepository";
import DepositUseCase from "./application/useCases/DepositUseCase";
import WithdrawUseCase from "./application/useCases/WithdrawUseCase";
import TransferUseCase from "./application/useCases/TransferUseCase";
import DepositController from "./interfaces/controllers/DepositController";
import WithdrawController from "./interfaces/controllers/WithdrawController";
import TransferController from "./interfaces/controllers/TransferController";

export class App {
    public readonly express: Express = express();
    private readonly port: number;
    private server: Server | undefined;

    constructor(port: number) {
        this.port = port;
        this.configureMiddleware();
        this.configureRoutes();
    }

    private configureMiddleware(): void {
        this.express.use(express.json());
    }

    private configureRoutes(): void {
        const accountRepository = new InMemoryAccountRepository();

        const depositUseCase = new DepositUseCase(accountRepository);
        const withdrawUseCase = new WithdrawUseCase(accountRepository);
        const transferUseCase = new TransferUseCase(accountRepository);

        const depositController = new DepositController(depositUseCase);
        const withdrawController = new WithdrawController(withdrawUseCase);
        const transferController = new TransferController(transferUseCase);

        this.express.post('/deposit', (req: Request, res: Response) => depositController.deposit(req, res));
        this.express.post('/withdraw', (req: Request, res: Response) => withdrawController.withdraw(req, res));
        this.express.post('/transfer', (req: Request, res: Response) => transferController.transfer(req, res));

        this.express.get('/dummy', (req: Request, res: Response) => {
            res.send('something!');
        });
    }

    start(): void {
        this.server = this.express.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    stop(): void {
        this.server?.close();
    }
}