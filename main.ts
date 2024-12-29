import express,{Request,Response} from 'express'
import passport from 'passport'
import './auth/auth.ts'
import { checkAccessToken, checkRefreshToken, createAuthTokens } from "./auth/AuthTokens.ts";
import { UserModel } from "./model/user.ts";
import { MongoServerError } from "mongodb";
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
  res.send('failure')
})
app.post('/register',async (req:any,res:any)=>{
  console.log(req.body)
  try {
    const newUser = new UserModel({username: req.body.username,refreshTokenVersion:1});
    await newUser.setPassword(req.body.password);
    await newUser.save();
    
  } catch (error) {
    console.log('register error:',error)
    if(error instanceof MongoServerError ){
      console.log('mongoServer error:',error.message)
      if(error.message.includes('E11000 duplicate key error')){
        return res.send('account already exists')
      }
    }
    return res.status(500).send('failed to register')
    
  }
  const { user } = await UserModel.authenticate()(req.body.username,req.body.password);
  const authTokens=createAuthTokens(user)
  res.json(authTokens)
})
app.post('/login',async(req:any,res:any)=>{
  try {
    const auth  = await UserModel.authenticate()(req.body.username,req.body.password);
    const authUser=auth.user
    if(authUser){
      const authTokens=createAuthTokens(authUser)
      return res.json(authTokens)
    }
    console.log(auth.error)
    if(auth.error){
      console.log('i was hit')
      if(auth.error.name=='IncorrectUsernameError'){
        console.log('i was hit again')
        return res.send('incorrect username')
      }
      else if(auth.error.name=='IncorrectPasswordError'){
        return res.send('incorrect password')
      }
      else if(auth.error.name=='TooManyAttemptsError'){
        return res.send('too many failed attempts')
      }
    }
    return res.send('makosa ni yangu')
  } catch (error:any) {
    return res.status(500).send('server error:',error.message)
    
  }
 
})
app.listen(3000,()=>console.log('running'))
