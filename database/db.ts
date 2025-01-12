import { MongoClient } from "mongodb";
import {AuthenticatedUser, GoogleProfile} from "../types/types.ts";


const MONGODB_URI = Deno.env.get("MONGODB_URI") || "";
console.log(MONGODB_URI)
const DB_NAME = Deno.env.get("DB_NAME") || "todo_db";
console.log(DB_NAME)

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  Deno.exit(1);
}

const client = new MongoClient(MONGODB_URI);

try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  Deno.exit(1);
}

const db = client.db(DB_NAME);
const users = db.collection("users");
async function addNewUser(profile:GoogleProfile){
    const newUser={refreshTokenVersion:1,username:profile.displayName,...profile}
    const user=await users.insertOne(newUser)
    return {_id:user.insertedId,...newUser}
}
async function userExists(userId:string):Promise<AuthenticatedUser | null>{
    const user=await users.findOne({id:userId})
    if(user){
        return user as AuthenticatedUser
    }
    return user

}

  
export { db, users,userExists,addNewUser};