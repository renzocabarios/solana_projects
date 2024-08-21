/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/random_program.json`.
 */
export type RandomProgram = {
  address: "9uVAUNJAgQuaAVsWE6zmVxb2kFhPLQHoNM8oUHq2WsRu";
  metadata: {
    name: "randomProgram";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "generateRandom";
      discriminator: [254, 116, 180, 225, 154, 19, 71, 154];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "randomState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [114, 97, 110, 100, 111, 109];
              },
              {
                kind: "account";
                path: "signer";
              }
            ];
          };
        },
        {
          name: "randomnessAccount";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "randomnessAccount";
          type: "pubkey";
        }
      ];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "randomState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [114, 97, 110, 100, 111, 109];
              },
              {
                kind: "account";
                path: "signer";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "settleRandom";
      discriminator: [130, 43, 167, 130, 113, 98, 75, 0];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "randomState";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [114, 97, 110, 100, 111, 109];
              },
              {
                kind: "account";
                path: "signer";
              }
            ];
          };
        },
        {
          name: "randomnessAccount";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "randomState";
      discriminator: [174, 112, 149, 122, 179, 74, 159, 32];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "unauthorized";
      msg: "Unauthorized access attempt.";
    },
    {
      code: 6001;
      name: "gameStillActive";
    },
    {
      code: 6002;
      name: "notEnoughFundsToPlay";
    },
    {
      code: 6003;
      name: "randomnessAlreadyRevealed";
    },
    {
      code: 6004;
      name: "randomnessNotResolved";
    },
    {
      code: 6005;
      name: "randomnessExpired";
    }
  ];
  types: [
    {
      name: "randomState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "random";
            type: "pubkey";
          },
          {
            name: "result";
            type: "u8";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
};
export const RandomProgram: RandomProgram = {
  address: "9uVAUNJAgQuaAVsWE6zmVxb2kFhPLQHoNM8oUHq2WsRu",
  metadata: {
    name: "randomProgram",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "generateRandom",
      discriminator: [254, 116, 180, 225, 154, 19, 71, 154],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "randomState",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [114, 97, 110, 100, 111, 109],
              },
              {
                kind: "account",
                path: "signer",
              },
            ],
          },
        },
        {
          name: "randomnessAccount",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "randomnessAccount",
          type: "pubkey",
        },
      ],
    },
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "randomState",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [114, 97, 110, 100, 111, 109],
              },
              {
                kind: "account",
                path: "signer",
              },
            ],
          },
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "settleRandom",
      discriminator: [130, 43, 167, 130, 113, 98, 75, 0],
      accounts: [
        {
          name: "signer",
          writable: true,
          signer: true,
        },
        {
          name: "randomState",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [114, 97, 110, 100, 111, 109],
              },
              {
                kind: "account",
                path: "signer",
              },
            ],
          },
        },
        {
          name: "randomnessAccount",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "randomState",
      discriminator: [174, 112, 149, 122, 179, 74, 159, 32],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "unauthorized",
      msg: "Unauthorized access attempt.",
    },
    {
      code: 6001,
      name: "gameStillActive",
    },
    {
      code: 6002,
      name: "notEnoughFundsToPlay",
    },
    {
      code: 6003,
      name: "randomnessAlreadyRevealed",
    },
    {
      code: 6004,
      name: "randomnessNotResolved",
    },
    {
      code: 6005,
      name: "randomnessExpired",
    },
  ],
  types: [
    {
      name: "randomState",
      type: {
        kind: "struct",
        fields: [
          {
            name: "random",
            type: "pubkey",
          },
          {
            name: "result",
            type: "u8",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
};
