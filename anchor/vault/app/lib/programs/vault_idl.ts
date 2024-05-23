export type VaultIdl = {
  version: "0.1.0";
  name: "vault";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "vaultAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "deposit";
      accounts: [
        {
          name: "vaultAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "withdraw";
      accounts: [
        {
          name: "vaultAuthority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "vaultAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "vaultAuthority";
            type: "publicKey";
          },
          {
            name: "amount";
            type: "u64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidAmount";
      msg: "The deposited amount is not the correct value.";
    },
    {
      code: 6001;
      name: "InsufficientFunds";
      msg: "Insufficient funds for withdrawal.";
    }
  ];
};

export const VaultIdl: VaultIdl = {
  version: "0.1.0",
  name: "vault",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "vaultAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "deposit",
      accounts: [
        {
          name: "vaultAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
    {
      name: "withdraw",
      accounts: [
        {
          name: "vaultAuthority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "vaultAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "vaultAuthority",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidAmount",
      msg: "The deposited amount is not the correct value.",
    },
    {
      code: 6001,
      name: "InsufficientFunds",
      msg: "Insufficient funds for withdrawal.",
    },
  ],
};
