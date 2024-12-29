import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import {GoogleProfile} from "../types/types.ts";
import { addNewUser, userExists } from "../database/db.ts";
import { UserModel } from "../model/user.ts";

passport.use(new GoogleStrategy({
    clientID: Deno.env.get("GOOGLE_CLIENT_ID"),
    clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET"),
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(_accessToken:string, _refreshToken:string, profile:GoogleProfile, done:any) {
    console.log(profile)
    let user=await userExists(profile.id)
    if(!user){
        user=await addNewUser(profile)
    }
    done(null,user)
  }
));

passport.use(UserModel.createStrategy());