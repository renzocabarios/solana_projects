import { UMI_INSTANCE } from "./config";

const main = async () => {
  const endpoint = UMI_INSTANCE.rpc.getEndpoint();
  console.log(`endpoint: ${endpoint}`);
};

main();
