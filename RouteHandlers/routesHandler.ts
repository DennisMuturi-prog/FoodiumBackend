// @deno-types="npm:@types/express@4.17.15"
import {RequestHandler} from 'express'
import { checkAccessToken,checkRefreshToken } from "../auth/AuthTokens.ts";

interface CheckAuthRequestBody{
    accessToken:string;
    refreshToken:string
}
export const checkAuthentication:RequestHandler=async (req,res,next)=>{
    const tokens=<CheckAuthRequestBody>req.body
    if(!(tokens.accessToken&& tokens.refreshToken)){
        return res.status(404).send('you have no access,log in or register')
    }
    const userData=checkAccessToken(tokens.accessToken)
    console.log('user data:',userData)
    if(userData=='unauthorized'){
      const refreshedUser=await checkRefreshToken(tokens.refreshToken)
      if(refreshedUser=='unauthorized'){
        return res.status(404).send('your credientials were revoked by principal account')
      }
      else{
        req.newTokens=refreshedUser.newTokens
        req.userId=refreshedUser.userId
        next()
      }
    }
    else{
      req.userId=userData.userId
      console.log(userData)
      next()
    }

}