import actionsRoute from "./actions/route";
import { IRoutes, IRoute } from "../../types";

const routes: IRoutes = [
  {
    url: "actions",
    route: actionsRoute,
  },
];

export default routes.map((e: IRoute) => {
  e.url = `v1/${e.url}`;
  return e;
});
