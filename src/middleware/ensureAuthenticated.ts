import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserRepository } from "../modules/accounts/repositories/implementations/UserRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error("Token missing");
  }

  const [, token] = authHeader.split(" ") //salva apenas a posição um do resultado do split e coloca o nome de token

  try {
    const { sub: user_id } = verify(token, "9a783bcc4c32b40050e9e1d26beb4d18") as IPayload;

    const usersRepository = new UserRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new Error("User does not exists!")
    }

    next();
  } catch {
    throw new Error("Invalid token!");
  }
}