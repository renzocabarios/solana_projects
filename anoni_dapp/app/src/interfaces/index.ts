import { AnchorProvider, Program } from "@coral-xyz/anchor";

export interface IWeb3Store {
  provider: null | AnchorProvider;
  wallet: null | string;
  posts: any[];
  setProvider: any;
  setWallet: any;
  getPosts: any;
}

export type IProgram = Program<AnoniDapp>;

export type AnoniDapp = {
  version: "0.1.0";
  name: "anoni_dapp";
  instructions: [
    {
      name: "createPost";
      accounts: [
        {
          name: "post";
          isMut: true;
          isSigner: true;
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

export const IDL: AnoniDapp = {
  version: "0.1.0",
  name: "anoni_dapp",
  instructions: [
    {
      name: "createPost",
      accounts: [
        {
          name: "post",
          isMut: true,
          isSigner: true,
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
