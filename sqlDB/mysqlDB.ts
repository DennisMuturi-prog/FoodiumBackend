// @ts-types="npm:@types/node@22.10.7"
import mysql, { PoolOptions} from 'npm:mysql2/promise';

const access: PoolOptions = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'foodium',
};
type oAuthUser={
    username:string,
    email:string,
    google_id:string
}
type passwordUser={
    username:string,
    email:string,
    password:string,
    salt:string,
}

const connection = await mysql.createPool(access);
// const results = await connection.query("CALL add_oauth_user('googleusertester8','good8@gmail.com','googly')");
// console.log(results[0]);
export async function registerOauthUser(registerRequest:oAuthUser){
    const results = await connection.query(`CALL add_oauth_user(?,?,?)`,[registerRequest.username,registerRequest.email,registerRequest.google_id]);
    return results[0]
}
export async function registerPasswordUser(registerRequest:passwordUser){
    const results = await connection.query(`CALL add_password_user(?,?,?,?)`,[registerRequest.username,registerRequest.email,registerRequest.password,registerRequest.salt]);
    return results[0]
}
export async function checkIfOAuthUserExists(google_id:string){
    const results=await connection.query(`CALL retrieve_google_oauth_user(?)`,[google_id])
    return results[0]
}
export async function checkIfPasswordUserExists(email:string){
    const results=await connection.query(`CALL retrieve_password_user(?)`,[email])
    return results[0]
}
export async function retrieveUser(id:number){
    const results=await connection.query(`CALL retrieve_user(?)`,[id])
    return results[0]
}



const testuser:oAuthUser={
    username:'dennis',
    email:'mutz@mutz.com',
    google_id:'googler',
}
const testuser2:passwordUser={
    username:'dennis',
    email:'mutz@mutz.com',
    password:'googler',
    salt:'saltChumvi'
}
// const result1=await registerOauthUser(testuser)
// console.log('result 1:',result1)
// const result2=await registerPasswordUser(testuser2)
// console.log('result 2:',result2)
// const result3=await checkIfOAuthUserExists('googly')
// console.log('result 3:',result3)
// const result4=await checkIfOAuthUserExists('nothing')
// console.log('result 4:',result4)






