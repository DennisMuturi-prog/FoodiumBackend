// @deno-types="npm:@types/express@4.17.15"
import express from 'express'
// @deno-types="npm:@types/passport@1.0.17"
import passport from 'passport'
import './auth/auth.ts'
import { createAuthTokens } from "./auth/AuthTokens.ts";
import { checkAuthentication, loginRouteHandler, registerRouteHandler } from "./RouteHandlers/routesHandler.ts";
import {fetchPaginatedRecipesHandler} from "./RouteHandlers/routesHandler.ts"

const app=express()
app.use(express.urlencoded({extended:false,limit: '50mb'}));
app.use(express.json({ limit: '50mb' }));
app.use(passport.initialize())
app.get(
  '/auth/google',
  passport.authenticate('google',{session:false,scope:['email','profile']})
)
app.get(
  '/auth/google/callback',
  (req,res)=>{
    passport.authenticate('google',{session:false},
      (err,user,_info,_status)=>{
        if(err){return res.status(404).send('failed to register')}
        if(user){
          const authTokens=createAuthTokens(user)
          res.cookie("id",authTokens.accessToken)
          res.cookie("rid",authTokens.refreshToken)
          return res.json(authTokens)
        }
        return res.redirect('/failure')
    
      }
    )(req, res)
  }
)
app.post('/protected',checkAuthentication,(req,res)=>{
  if(req.newTokens){
    return res.json({id:req.userId,newTokens:req.newTokens})
  }
  return res.json({id:req.userId})
})
app.post('/register',registerRouteHandler)
app.post('/login',loginRouteHandler)
app.post('/getRecipes',fetchPaginatedRecipesHandler)
app.get('/failure', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Failure</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8d7da;
          color: #721c24;
          text-align: center;
          padding: 50px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #f5c6cb;
          border-radius: 5px;
          background-color: #f8d7da;
        }
        h1 {
          font-size: 2em;
        }
        p {
          font-size: 1.2em;
        }
        a {
          color: #721c24;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Authentication Failed</h1>
        <p>Sorry, we couldn't authenticate your request. Please try again.</p>
        <p><a href="/">Go back to the homepage</a></p>
      </div>
    </body>
    </html>
  `);
});

app.listen(3000,()=>console.log('running'))
