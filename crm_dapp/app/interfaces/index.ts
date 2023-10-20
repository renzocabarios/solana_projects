import { AnchorProvider, Program } from "@coral-xyz/anchor";

export interface IWeb3Store {
  wallet: null | string;
  setWallet: any;
}

export interface ICustomerStore {
  customer: any[];
  setCustomer: any;
}

export type IProgram = Program<CrmDapp>;

export type CrmDapp = {
  version: "0.1.0";
  name: "crm_dapp";
  instructions: [
    {
      name: "createCustomer";
      accounts: [
        {
          name: "customer";
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
          name: "firstName";
          type: "string";
        },
        {
          name: "lastName";
          type: "string";
        },
        {
          name: "email";
          type: "string";
        }
      ];
    },
    {
      name: "updateCustomer";
      accounts: [
        {
          name: "customer";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "firstName";
          type: "string";
        },
        {
          name: "lastName";
          type: "string";
        },
        {
          name: "email";
          type: "string";
        }
      ];
    },
    {
      name: "deleteCustomer";
      accounts: [
        {
          name: "customer";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "customer";
      type: {
        kind: "struct";
        fields: [
          {
            name: "firstName";
            type: "string";
          },
          {
            name: "lastName";
            type: "string";
          },
          {
            name: "email";
            type: "string";
          },
          {
            name: "deleted";
            type: "bool";
          }
        ];
      };
    }
  ];
};
