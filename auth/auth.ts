// @deno-types="npm:@types/passport@1.0.17"
import passport from 'passport'
// @deno-types="npm:@types/passport-google-oauth20@2.0.16"
import  {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import { registerOauthUser } from "../sqlDB/mysqlDB.ts";

const clientID = Deno.env.get("GOOGLE_CLIENT_ID") || '';
const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET") || '';

passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(_accessToken, _refreshToken, profile, done) {
    try {
      if(profile.emails){
        const oauthUser={
          email:profile.emails[0].value,
          google_id:profile.id
        }
        //registerOauthuser has logic to check if a user exists already embedded in database
        const user=await registerOauthUser(oauthUser)
        console.log(user)
        return done(null,user)
      }
      
    } catch (error) {
      done(error)
      
    }

  }
  
));