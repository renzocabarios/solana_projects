export type Enroll = {
  version: "0.1.0";
  name: "enroll";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "enrollment";
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
          name: "discord";
          type: "string";
        },
        {
          name: "github";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "enrollment";
      type: {
        kind: "struct";
        fields: [
          {
            name: "discord";
            type: "string";
          },
          {
            name: "github";
            type: "string";
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

export const IDL: Enroll = {
  version: "0.1.0",
  name: "enroll",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "enrollment",
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
          name: "discord",
          type: "string",
        },
        {
          name: "github",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "enrollment",
      type: {
        kind: "struct",
        fields: [
          {
            name: "discord",
            type: "string",
          },
          {
            name: "github",
            type: "string",
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
