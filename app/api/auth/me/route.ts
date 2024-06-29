import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { users } from "../login/route";

export const GET = async (req: NextRequest) => {
  const authorization = req.headers.get("authorization");

  if (!authorization) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  try {
    const token = authorization.split(" ")[1];
    const data = jwt.verify(token, process.env.NEXT_JWT_SECRET as string);

    if (typeof data !== "string") {
      const userId = data.userId;
      const user = users.find((u) => u.id === userId);
      
      if (user) {
        return NextResponse.json({
          userId,
          user: { username: user.username },
        });
      } else {
        return NextResponse.json(
          { message: "No such user found!" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json({ message: "Forbidden!" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Forbidden!" }, { status: 403 });
  }
};
