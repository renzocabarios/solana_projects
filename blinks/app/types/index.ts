import { Router } from "express";

export interface IModel {
  _id?: string | any;
  deleted?: Boolean;
}

export interface IUserModel extends IModel {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IRoute {
  url: string;
  route: Router;
}

export type IRoutes = IRoute[];

export interface IQuery {
  page?: number;
  limit?: number;
  filter?: any;
  populate?: string;
}
