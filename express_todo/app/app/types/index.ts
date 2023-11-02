import { RESOURCE } from "../constants";

export interface IUserModel {
  firstName: string;
  lastName: string;
  __t?: string;
  deleted?: Boolean;
}

export interface IAddUserDto {
  firstName: string;
  lastName: string;
  type?: string;
  deleted?: Boolean;
}
