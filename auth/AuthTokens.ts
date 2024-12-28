import * as jwt from "jsonwebtoken";
import {AuthenticatedUser} from "../types/types.ts";
import { userExists } from "../database/db.ts";
export type RefreshTokenData = {
    userId: string;
    refreshTokenVersion?: number;
};
  
export type AccessTokenData = {
userId: string;
};
  
export const createAuthTokens = (
    user: AuthenticatedUser
  ): { refreshToken: string; accessToken: string } => {
    const refreshToken = jwt.sign(
      { userId: user.id, refreshTokenVersion: user.refreshTokenVersion },
      Deno.env.get("REFRESH_TOKEN_SECRET")!,
      {
        expiresIn: "30d",
      }
    );
  
    const accessToken = jwt.sign(
      { userId: user.id },
      Deno.env.get("ACCESS_TOKEN_SECRET")!,
      {
        expiresIn: "15min",
      }
    );
  
    return { refreshToken, accessToken };
  };
export const checkAccessToken=(accessToken:string)=>{
try {
    const data = <AccessTokenData>(
        jwt.verify(accessToken, Deno.env.get("ACCESS_TOKEN_SECRET")!)
        );
        // get userId from token data
        return {
        userId: data.userId,
        };

    
} catch {
    return 'unauthorized'
    
}


}
export const checkRefreshToken=async (refreshToken:string)=>{
    let data;
    try {
    data = <RefreshTokenData>(
        jwt.verify(refreshToken, Deno.env.get("REFRESH_TOKEN_SECRET")!)
    );
    } catch {
        return 'unauthorized';
    }

    // 2. get user
    const user = await userExists(data.userId)

    // 3.check refresh token version
    if (!user || user.refreshTokenVersion !== data.refreshTokenVersion) {
    return 'unauthorized'
    }
    const newTokens=createAuthTokens(user)
    return {
    userId: data.userId,
    newTokens,
    };
}
