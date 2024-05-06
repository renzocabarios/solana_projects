export const ENROLL_PROGRAM_ID = "FDDbT6pAmifx3GffUhq67FZBEZp1ggYmhdiWwAoJRY5T";

export type ENROLL_IDL = {
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
        },
      ];
      args: [
        {
          name: "discord";
          type: "string";
        },
        {
          name: "github";
          type: "string";
        },
      ];
    },
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
          },
        ];
      };
    },
  ];
  metadata: {
    version: "0.1.0";
    name: "enroll";
    spec: "qwd";
  };
  address: "FDDbT6pAmifx3GffUhq67FZBEZp1ggYmhdiWwAoJRY5T";
};

export const ENROLL_IDL: ENROLL_IDL = {
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
  metadata: {
    version: "0.1.0",
    name: "enroll",
    spec: "qwd",
  },
  address: "FDDbT6pAmifx3GffUhq67FZBEZp1ggYmhdiWwAoJRY5T",
};
