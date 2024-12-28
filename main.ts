import express,{Request,Response} from 'express'
import passport from 'passport'
import './auth/auth.ts'
import { checkAccessToken, checkRefreshToken, createAuthTokens } from "./auth/AuthTokens.ts";
// import { AuthenticatedRequest } from "./types/types.ts";
const app=express()
async function checkAuthentication(req:any,res:any,next:any){
  if(req.body.accessToken && req.body.refreshToken){
    const userData=checkAccessToken(req.body.accessToken)
    console.log('user data:',userData)
    if(userData=='unauthorized'){
      const refreshedUser=await checkRefreshToken(req.body.refreshToken)
      if(refreshedUser=='unauthorized'){
        res.send('failure,you have no access')
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
  else{
    res.send('please sign up or log in')
  }
}
app.use(express.urlencoded({extended:false,limit: '50mb'}));
app.use(express.json({ limit: '50mb' }));
app.use(passport.initialize())
app.get(
  '/auth/google',
  passport.authenticate('google',{session:false,scope:['email','profile']})
)
app.get(
  '/auth/google/callback',
  passport.authenticate('google',{session:false}),
  (req:any,res:any)=>{
    if(req.user){
      const authTokens=createAuthTokens(req.user)
      res.cookie("id",authTokens.accessToken)
      res.cookie("rid",authTokens.refreshToken)
      return res.json(authTokens)
    }
    return res.redirect('/failure')

  }
)
app.post('/protected',checkAuthentication,(req:any,res:any)=>{
  if(req.newTokens){
    return res.json({newTokens:req.newTokens,id:req.userId})
  }
  return res.send(req.userId)
})
app.get('/failure',(req:any,res:any)=>{
  console.log(req.user)
  res.send('failure')
})
app.listen(3000,()=>console.log('running'))
