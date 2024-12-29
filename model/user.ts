import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
const Schema=mongoose.Schema;
const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
      },
      refreshTokenVersion: {
        type: Number,
        required: true,
      },
      attempts:{
        type:Number,
        required:true
      },
      last:{
        type:Date,
        required:true
      }

});
User.plugin(passportLocalMongoose,{limitAttempts:true,maxAttempts:4,maxInterval:120000,unlockInterval:120000});
const mongodb_uri=Deno.env.get('MONGODB_URI');
if(mongodb_uri){
    mongoose.connect(mongodb_uri,{dbName:'authentication'});
}
export const UserModel = mongoose.model('User', User);
