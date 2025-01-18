const { LOCALHOST } = require("@metaplex-foundation/amman");
const path = require("path");

function localDeployPath(programName) {
  return path.join(__dirname, `programs`, `${programName}.so`);
}

module.exports = {
  validator: {
    killRunningValidators: true,
    accountsCluster: "https://example.solana-mainnet.quiknode.pro/123456/", // 👈 Replace with your own QuickNode endpoint
    programs: [
      {
        label: "Metaplex Metadata",
        programId: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
        deployPath: localDeployPath("metadata"),
      },
    ],
    jsonRpcUrl: LOCALHOST,
    websocketUrl: "",
    commitment: "confirmed",
    resetLedger: true,
    verifyFees: false,
    detached: process.env.CI != null,
  },
  relay: {
    enabled: process.env.CI == null,
    killRunningRelay: true,
  },
  storage: {
    enabled: process.env.CI == null,
    storageId: "mock-storage",
    clearOnStart: true,
  },
};
