import type { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import check from "./middleware/check";
import { literalize } from "./services/literalize";

const schema = Joi.object({
  number: Joi.number().required().max(99999),
});

type Res = {
  literal: string;
};

export default check({ body: schema }, (req: NextApiRequest, res: NextApiResponse<Res>) => {
  res.status(200).json({ literal: literalize(req.body.number) });
});
