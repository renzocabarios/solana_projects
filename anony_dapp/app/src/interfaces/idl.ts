export type AnonyDapp = {
  version: "0.1.0";
  name: "anony_dapp";
  instructions: [
    {
      name: "createPost";
      accounts: [
        {
          name: "post";
          isMut: true;
          isSigner: false;
        },
        {
          name: "signer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "title";
          type: "string";
        },
        {
          name: "content";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "post";
      type: {
        kind: "struct";
        fields: [
          {
            name: "creator";
            type: "publicKey";
          },
          {
            name: "title";
            type: "string";
          },
          {
            name: "content";
            type: "string";
          }
        ];
      };
    }
  ];
};

export const IDL: AnonyDapp = {
  version: "0.1.0",
  name: "anony_dapp",
  instructions: [
    {
      name: "createPost",
      accounts: [
        {
          name: "post",
          isMut: true,
          isSigner: false,
        },
        {
          name: "signer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "title",
          type: "string",
        },
        {
          name: "content",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "post",
      type: {
        kind: "struct",
        fields: [
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "title",
            type: "string",
          },
          {
            name: "content",
            type: "string",
          },
        ],
      },
    },
  ],
};
