// @deno-types="npm:@types/express@4.17.15"
import {RequestHandler} from 'express'
import { checkAccessToken,checkRefreshToken, createAuthTokens } from "../auth/AuthTokens.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { checkIfPasswordUserExists, registerPasswordUser } from "../sqlDB/mysqlDB.ts";

interface CheckAuthRequestBody{
    accessToken:string;
    refreshToken:string
}
interface RegisterRequestBody{
    username:string;
    email:string;
    password:string;
}
interface LoginRequestBody{
    username:string;
    password:string;
}
export const loginRouteHandler:RequestHandler=async (req,res)=>{
    try {
        const loginInfo=<LoginRequestBody>req.body
        if(!(loginInfo.username&& loginInfo.password)){
            return res.status(404).send('provide all fields:username,password')
        }
        const possibleUser=await checkIfPasswordUserExists(loginInfo.username)
        if(possibleUser[0].length==0){
            return res.status(404).send('no account with such username exists')
        }
        const hashedPassword=possibleUser[0][0]['hashed_password']
        const correctpassword=await bcrypt.compare(loginInfo.password,hashedPassword)
        if(!correctpassword){
            return res.status(404).send('wrong password')
        }
        const userInfo={
            id:possibleUser[0][0]['id'],
            refreshTokenVersion:possibleUser[0][0]['refreshTokenversion'],
        }
        const userTokens=createAuthTokens(userInfo)
        return res.json(userTokens)

        
    } catch (error) {
        console.log('error at login',error)
        return res.status(404).send('an error occurred,try again')  
    }
}

export const registerRouteHandler:RequestHandler=async (req,res)=>{
    const registerInfo=<RegisterRequestBody>req.body
    if(!(registerInfo.username&&registerInfo.email&&registerInfo.password)){
        return res.status(404).send('provide all fields:username,email,password')
    }
    try {
        const possibleUser=await checkIfPasswordUserExists(registerInfo.username)
        if(possibleUser[0].length>0){
            return res.status(404).send('user acccount already exists')
        }
        const hashedPassword=await bcrypt.hash(registerInfo.password)
        const userObj={
            username:registerInfo.username,
            email:registerInfo.email,
            password:hashedPassword
        }
        const user=await registerPasswordUser(userObj)
        const registeredUser={
            id:user[0][0]['last_insert_id()'],
            refreshTokenVersion:0
        }
        const userTokens=createAuthTokens(registeredUser)
        return res.json(userTokens)
        
    } catch (error) {
        console.log('error at register route:',error)
        return res.status(404).send('an error occurred,try again,') 
    }
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