// @deno-types="npm:@types/express@4.17.15"
import {RequestHandler} from 'express'
import { checkAccessToken,checkRefreshToken } from "../auth/AuthTokens.ts";

interface RequestBody{
    accessToken:string;
    refreshToken:string
}
const checkAuthentication:RequestHandler=async (req,res,next)=>{
    const tokens=<RequestBody>req.body
    if(!(tokens.accessToken&& tokens.refreshToken)){
        return res.status(404).send('you have no access,log in or register')
    }
    const userData=checkAccessToken(tokens.accessToken)
    console.log('user data:',userData)
    if(userData=='unauthorized'){
      const refreshedUser=await checkRefreshToken(tokens.refreshToken)
      if(refreshedUser=='unauthorized'){
        return res.status(404).send('your credientials were revoked by primcipal user')
      }
      else{
        req.newTokens=refreshedUser.newTokens
        req.userId=refreshedUser.userId
        next()
      }
    }
    else{
      req.userId=userData.userId
      next()
    }

}