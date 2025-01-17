// @ts-types="npm:@types/node@22.10.7"
import mysql, { PoolOptions} from 'npm:mysql2/promise';

const access: PoolOptions = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'foodium',
};
type oAuthUser={
    email:string,
    google_id:string
}
type passwordUser={
    username:string,
    email:string,
    password:string,
}
type usernameAvailabilty={
    status:string
}

const connection = await mysql.createPool(access);
// const results = await connection.query("CALL add_oauth_user('googleusertester8','good8@gmail.com','googly')");
// console.log(results[0]);
export async function registerOauthUser(registerRequest:oAuthUser){
    const results = await connection.query(`CALL add_oauth_user(?,?)`,[registerRequest.email,registerRequest.google_id]);
    return results[0]
}
export async function registerPasswordUser(registerRequest:passwordUser){
    const results = await connection.query(`CALL add_password_user(?,?,?)`,[registerRequest.username,registerRequest.email,registerRequest.password]);
    return results[0]
}
export async function checkIfPasswordUserExists(username:string){
    const results=await connection.query(`CALL retrieve_password_user(?)`,[username])
    return results[0]
}
export async function retrieveUser(id:number){
    const results=await connection.query(`CALL retrieve_user(?)`,[id])
    return results[0]
}
export async function checkUsernameAvaliabilty(username:string):Promise<usernameAvailabilty>{
    const results=await connection.query(`CALL check_username_availability(?)`,[username])
    return results[0][0][0]
}
export async function updateOauthUserUsername(username:string,userId:string){
    const results=await connection.query(`CALL update_oauthUser_username(?,?)`,[username,userId])
    return results[0]

}
// const test=await checkUsernameAvaliabilty('mimi2')
// console.log(test)



// const testuser:oAuthUser={
//     email:'mutz@mutz.com',
//     google_id:'testgoogle5',
// }
// const testuser2:passwordUser={
//     username:'dennis',
//     email:'mutz@mutz.com',
//     password:'googler',
//     salt:'saltChumvi'
// }
// const result1=await registerOauthUser(testuser)
// console.log('result 1:',result1[0][0])

// const result2=await registerPasswordUser(testuser2)
// console.log('result 2:',result2)
// const result3=await checkIfOAuthUserExists('googly')
// console.log('result 3:',result3)
// const result4=await checkIfOAuthUserExists('nothing')
// console.log('result 4:',result4)
interface Recipe {
    id: number;
    recipe_name: string;
    ingredients: string; // JSON string
    directions: string; // JSON string
    NER: string; // JSON string
    Carbohydrate_by_difference: number;
    Carbohydrate_by_summation: number;
    Energy: number;
    Fiber_total_dietary: number;
    Iron_Fe: number;
    Protein: number;
    Retinol: number;
    Riboflavin: number;
    Starch: number;
    Sugars_Total: number;
    Total_fat_NLEA: number;
    Vitamin_A_RAE: number;
    Vitamin_B_12: number;
    Vitamin_C_total_ascorbic_acid: number;
    Vitamin_D_D2_and_D3: number;
    Vitamin_D4: number;
    image_url: string;
  }

export async function getPaginatedRecipes(number_of_results:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_paginated_recipes(?,?)`,[next,number_of_results])
        let recipes:Recipe[]=results[0][0]
        recipes=recipes.map((recipe)=>{
            return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
            }}
        )
        return recipes

    }
    else{
        const results=await connection.query(`CALL get_first_page_recipes(?)`,[number_of_results])
        let recipes:Recipe[]=results[0][0]
        recipes=recipes.map((recipe)=>{
            return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
            }}
        )
        return recipes

    }


}




