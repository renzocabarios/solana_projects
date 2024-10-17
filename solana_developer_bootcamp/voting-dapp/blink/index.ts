import { app } from "./app";
import ENV from "./env";

(() => {
  app.listen(9000, () => {
    console.log("solana-action-express is running!");
  });
})();
