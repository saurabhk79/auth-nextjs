import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const users = [
  { id: 1, username: "user", password: bcrypt.hashSync("00000000", 8) },
  { id: 2, username: "testuser", password: bcrypt.hashSync("12345678", 8) },
  { id: 3, username: "myuser", password: bcrypt.hashSync("123456789", 8) },
];

export const POST = async (req: NextRequest) => {
  const { username, password } = await req.json();
  const user = users.find((u) => u.username === username);

  if (user && bcrypt.compareSync(password, user.password)) {

    const token = jwt.sign(
      { userId: user.id },
      process.env.NEXT_JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return NextResponse.json({ token });
  } else
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
};
