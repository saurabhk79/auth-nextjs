import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export const GET = (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).end();

  try {
    const token = authorization.split(' ')[1] 
    const data = jwt.verify(token, process.env.NEXT_JWT_SECRET as string);

    if (typeof data !== "string") {
      const userId = data.userId;
      res.status(200).json({ userId });
    }

  } catch {
    res.status(401).end();
  }
};
