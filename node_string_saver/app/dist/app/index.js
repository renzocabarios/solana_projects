"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@coral-xyz/anchor");
const nodewallet_js_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet.js"));
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const node_string_saver_1 = require("../target/types/node_string_saver");
const connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)("devnet"));
const keypair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode("3e4Ve7ofQxXCLqR9iRrEXQQRJLUNKJG9FxQQdAuhzdSZy8A2QJawqQTN135qKHb71Hd2R2uRon4x4AcMNPWQVgEE"));
const wallet = new nodewallet_js_1.default(keypair);
const provider = new anchor_1.AnchorProvider(connection, wallet, {
    commitment: "processed",
});
const program = new anchor_1.Program(node_string_saver_1.IDL, new web3_js_1.PublicKey("4BURzfAxaZbwk8HwBmbo3U7yQYu4Zok9bttGuXjkkWvq"), provider);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const stringHolder = web3_js_1.Keypair.generate();
    yield program.methods
        .initialize()
        .accounts({
        stringHolder: stringHolder.publicKey,
        user: provider.publicKey,
        systemProgram: anchor_1.web3.SystemProgram.programId,
    })
        .signers([stringHolder])
        .rpc();
    yield program.methods
        .add("asd")
        .accounts({
        stringHolder: stringHolder.publicKey,
    })
        .rpc();
    const accounts = yield program.account.stringHolder.all();
    console.log(accounts);
    console.log(yield program.account.stringHolder.fetch(stringHolder.publicKey));
});
start();
