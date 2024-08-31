import express, { Request, Response, NextFunction } from "express";
import { ActionGetResponse, ActionPostResponse, ActionsJson, createPostResponse } from "@solana/actions";
import cors from "cors";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const app = express();

app.use(express.json());


app.options(
	"*",
	cors({
		methods: ["GET,HEAD,PUT,PATCH,DELETE,OPTIONS"],
		allowedHeaders: [
			"Context-Type, Authorization, Content-Encoding, Accept-Encoding",
		],
		preflightContinue: true,
		optionsSuccessStatus: 204,
	})
)

app.use((req: Request, res: Response, next: NextFunction) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, Content-Encoding, Accept-Encoding"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
	);
	res.setHeader("Content-Encoding", "compress");
	res.setHeader("Content-Type", "application/json");
	next();
});

app.use("/actions.json", (req: Request, res: Response) => {
	const payload: ActionsJson = {
		rules: [
			{
				pathPattern: "/*",
				apiPath: "/actions/*",
			},
			{
				pathPattern: "/actions/**",
				apiPath: "/actions/**",
			},
		],
	};
	res.json(payload);
});

app
	.get("/actions/raffle", (req, res) => {
		const payload: ActionGetResponse = {
			type: "action",
			title: "Actions Example - Transfer Native SOL",
			icon: "https://scontent.fmnl17-3.fna.fbcdn.net/v/t1.15752-9/456566829_1711901823073025_1368723189421534580_n.png?_nc_cat=103&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEoeLiZfBtMfNQWnlCfyUT3YLDqsOkeEwZgsOqw6R4TBkDJiaA0E92OTRkCUwqlgVJtGmAcRYxW-lzUmhyznd2W&_nc_ohc=k-1zKEMIKDMQ7kNvgEJwHUj&_nc_ht=scontent.fmnl17-3.fna&oh=03_Q7cD1QGaNO1M3Lsj0BpQE2DpkMHylyJfPWAQq9kVA96tieK5LQ&oe=66F7C7F0",
			description: "Transfer SOL to another Solana wallet",
			label: "Transfer",
		};
		res.json(payload);
	})
	.post("/actions/raffle", async (req, res) => {
		const { account } = req.body;
		const transaction = await transferSolTransaction({ from: account });
		console.log(transaction);

		const payload: ActionPostResponse = await createPostResponse({
			fields: {
				transaction,
				message: `Send 1 SOL`,
			},
		});

		res.json(payload);
	});

export const transferSolTransaction = async ({
	from,
}: { from: string }): Promise<Transaction> => {
	const fromPubkey = new PublicKey(from);
	const toPubkey = new PublicKey(
		"7gGSitZAwiYVyeMPtvt3DDVgTJsawKc47F4cKb2zW6Fm"
	);

	const connection = new Connection(clusterApiUrl("mainnet-beta"));

	const minimumBalance = await connection.getMinimumBalanceForRentExemption(0);

	const transaction = new Transaction();
	transaction.feePayer = fromPubkey;

	transaction.add(
		SystemProgram.transfer({
			fromPubkey: fromPubkey,
			toPubkey: toPubkey,
			lamports: minimumBalance,
		})
	);

	transaction.recentBlockhash = (
		await connection.getLatestBlockhash()
	).blockhash;

	return transaction;
};
app.listen(9000, () => {
	console.log("solana-action-express is running!");
});




