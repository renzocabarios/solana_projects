import "express-async-errors";
import ENV from "./app/env/index";
import app from "./app";

(() => {
  app.listen(ENV.PORT, () => {
    console.log(`Server started on port ${ENV.PORT}`);
  });
})();
