import { Client,TLSConfig,TLSMode } from "https://deno.land/x/mysql/mod.ts"; 
const tlsConfig: TLSConfig = {
    mode: TLSMode.VERIFY_IDENTITY,
    caCerts: [
        await Deno.readTextFile("DigiCertGlobalRootCA.crt.pem"),
    ],
    };
console.log(Deno.env.get("AZURE_HOSTNAME"));

const connectionOptions={
    hostname: Deno.env.get("AZURE_HOSTNAME"),
    username: Deno.env.get("AZURE_USERNAME"),
    password: Deno.env.get("AZURE_PASSWWORD"), 
    db:Deno.env.get("AZURE_DB"), 
    port:3306,
    tls: tlsConfig
}
const connection = await new Client().connect(connectionOptions);
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
    return results
}
export async function retrieveUser(id:number){
    const results=await connection.query(`CALL retrieve_user(?)`,[id])
    return results
}
export async function checkUsernameAvailability(username:string):Promise<usernameAvailabilty>{
    const results=await connection.query(`CALL check_username_availability(?)`,[username])
    return results[0]
}
export async function updateOauthUserUsername(username:string,userId:number){
    const results=await connection.query(`CALL update_oauthUser_username(?,?)`,[username,userId])
    return results
    
}
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
export interface Review{
    reviewText:string;
    recipeId:number;
    reviewerId:number
}
export interface Rating{
    ratingNumber:number;
    recipeId:number;
    raterId:number
}
export interface RecipeIntake{
    userId:number
    recipeId:number
}
export async function addRecipeIntake(recipeIntake:RecipeIntake){
    const results = await connection.query(`CALL add_recipe_intake(?,?)`,[recipeIntake.userId,recipeIntake.recipeId]);
    return results
}
export async function findUserReviews(userId:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_user_paginated_reviews(?,?)`,[userId,next])
        return results
    }
    else{
        const results=await connection.query(`CALL get_user_first_page_reviews(?)`,[userId])
        return results
    }
}
export async function findUserRatings(userId:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_user_paginated_ratings(?,?)`,[userId,next])
        return results
        
    }
    else{
        const results=await connection.query(`CALL get_user_first_page_ratings(?)`,[userId])
        return results
    }
}
export async function findRecipeReviews(recipeId:number,number_of_results?:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_paginated_reviews(?,?,?)`,[recipeId,number_of_results,next])
        return results
    }
    else{
        const results=await connection.query(`CALL get_first_page_reviews(?,?)`,[recipeId,number_of_results])
        return results
    }
}
export async function addReview(review:Review):Promise<{task:string}>{
    const results = await connection.query(`CALL add_recipe_review(?,?,?)`,[review.reviewText,review.recipeId,review.reviewerId]);
    
    return results[0]
}
export async function addRating(rating:Rating):Promise<{task:string}>{
    const results = await connection.query(`CALL add_recipe_rating(?,?,?)`,[rating.ratingNumber,rating.recipeId,rating.raterId]);
    return results[0]
}
export async function getPaginatedRecipes(number_of_results:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_paginated_recipes(?,?)`,[next,number_of_results])
        let recipes:Recipe[]=results
        recipes=recipes.map((recipe)=>{
            return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
            }}
        )
        return recipes
        
    }
    else{
        const results=await connection.query(`CALL get_first_page_recipes(?)`,[number_of_results])
        let recipes:Recipe[]=results
        recipes=recipes.map((recipe)=>{
            return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
            }}
        )
        return recipes
        
    }
    
    
}
export async function findUserRecipeIntake(userId:number,next?:number){
    if(next){
        let recipes:Recipe[]=await connection.query(`CALL get_user_paginated_recipe_intake(?,?)`,[userId,next])
        recipes=recipes.map((recipe)=>{
            return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
            }}
        )
        return recipes

    }
    else{
        let recipes:Recipe[]=await connection.query(`CALL get_user_first_page_recipe_intake(?)`,[userId])
        recipes=recipes.map((recipe)=>{
            return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
            }}
        )
        return recipes  
    }   
}