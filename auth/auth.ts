// @deno-types="npm:@types/passport@1.0.17"
import passport from 'passport'
// @deno-types="npm:@types/passport-google-oauth20@2.0.16"
import  {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { checkIfOAuthUserExists, registerOauthUser } from "../sqlDB/mysqlDB.ts";

const clientID = Deno.env.get("GOOGLE_CLIENT_ID") || '';
const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") || '';

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(_accessToken, _refreshToken, profile, done) {
    try {
      let user=await checkIfOAuthUserExists(profile.id)
      if(user[0].length==0){
        if(profile.emails){
          const Oauthuser={
            username:profile.displayName,
            email:profile.emails[0].value,
            google_id:profile.id
          }
          user=await registerOauthUser(Oauthuser)
          const userObj={
            id:user[0][0]['LAST_INSERT_ID()'],
            refreshTokenVersion:0
          }
          user=userObj
          return done(null,user)
        }
      }
      else{
        user=user[0][0]
        return done(null,user)
      }
    } catch (error) {
      return done(error) 
    }
  }
));