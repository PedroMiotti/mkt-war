import jwt_decode from "jwt-decode";
import { getCookie, deleteCookie } from "./handleCookie";

export interface IToken{
  exp: number,
  iat: number,
  key: number
}

export const getUserIdByToken = (): IToken => {
  let user_id: IToken = {exp: 0, iat: 0, key: 0 };
  let hasToken: string = getCookie("_token");
  if (hasToken) {
    user_id = jwt_decode(hasToken);
  }

  return user_id;
};
