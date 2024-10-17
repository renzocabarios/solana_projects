import "express-async-errors";
import express from "express";
import cors from "cors";
import {
  ActionError,
  ActionGetResponse,
  ActionPostResponse,
  ActionsJson,
  createPostResponse,
} from "@solana/actions";
import { transferSolTransaction, voteTransaction } from "./transactions";
import { startSession, ClientSession } from "mongoose";
import { addMiddlewares } from "./middlewares";
export const app = express();

// MIDDLEWARES
addMiddlewares(app);

// ROUTES
app.use("/actions.json", (req, res) => {
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
  .get("/actions/vote", (req, res) => {
    const payload: ActionGetResponse = {
      type: "action",
      title: "Vote Now",
      icon: "https://scontent.fmnl17-3.fna.fbcdn.net/v/t1.15752-9/454803144_1548754692715033_6543378702746072351_n.png?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEPHvqC-ExSyfHXcsvtgZXXejZ-NZOEsqR6Nn41k4SypLtOP7N7hkIKvIPmo-YgOB0erF69pTRMMDYvl6wSEphB&_nc_ohc=eQ4ZmXX1hzsQ7kNvgEe0gMI&_nc_ht=scontent.fmnl17-3.fna&oh=03_Q7cD1QHWCDVJC7HJDmST-TibG53HyqoekbC_WDNpDfE6h-Ffbg&oe=66FBCD09",
      description: ``,
      label: "Join the vote",
    };

    console.log(payload);

    res.json(payload);
  })
  .post("/actions/vote", async (req, res) => {
    const { account } = req.body;

    try {
      console.log(account);

      const transaction = await voteTransaction({ from: account });
      res.json(transaction);
      return;
    } catch (err: any) {
      console.log(1);

      let actionError: ActionError = {
        message: "You have already joined the raffle",
      };
      res.status(400).json(actionError);
    }
  });
