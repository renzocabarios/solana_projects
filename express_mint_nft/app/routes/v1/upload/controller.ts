import { Request, Response } from "express";
import { upload } from "../../../utils/index.js";
import fs from "fs";

const image = async (_req: Request, _res: Response) => {
  if (!_req?.file) {
    _res.send({
      data: [],
      status: "fail",
      message: "No image found",
    });
    return;
  }
  const response = await upload(_req.file.path ?? "");
  await fs.unlink(_req.file.path, () => {});

  _res.send({
    data: [{ path: response.secure_url }],
    status: "success",
    message: "Create image success",
  });
};
export { image };
