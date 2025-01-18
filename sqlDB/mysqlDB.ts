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
    return results[0]
}
export async function findUserReviews(userId:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_user_paginated_reviews(?,?)`,[userId,next])
        return results[0][0]
    }
    else{
        const results=await connection.query(`CALL get_user_first_page_reviews(?)`,[userId])
        return results[0][0]
    }
}
export async function findUserRatings(userId:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_user_paginated_ratings(?,?)`,[userId,next])
        return results[0][0]

    }
    else{
        const results=await connection.query(`CALL get_user_first_page_ratings(?)`,[userId])
        return results[0][0]  
    }
}
export async function findRecipeReviews(recipeId:number,number_of_results?:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_paginated_reviews(?,?,?)`,[recipeId,number_of_results,next])
        return results[0][0]
    }
    else{
        const results=await connection.query(`CALL get_first_page_reviews(?,?)`,[recipeId,number_of_results])
        return results[0][0]
    }
}
export async function addReview(review:Review){
    const results = await connection.query(`CALL add_recipe_review(?,?,?)`,[review.reviewText,review.recipeId,review.reviewerId]);
    if(results[1]==undefined){
        return 'already reviewed'
    }
    return results[0][0][0]
}
export async function addRating(rating:Rating){
    const results = await connection.query(`CALL add_recipe_rating(?,?,?)`,[rating.ratingNumber,rating.recipeId,rating.raterId]);
    if(results[1]==undefined){
        return 'already rated'
    }
    return results[0][0][0]
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
export async function findUserRecipeIntake(userId:number,next?:number){
    if(next){
        const results=await connection.query(`CALL get_user_paginated_recipe_intake(?,?)`,[userId,next])
        let recipes:Recipe[]=results[0][0]
        recipes=recipes.map((recipe)=>{
            return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
            }}
        )
        return recipes

    }
    else{
        const results=await connection.query(`CALL get_user_first_page_recipe_intake(?)`,[userId])
        let recipes:Recipe[]=results[0][0]
        recipes=recipes.map((recipe)=>{
            return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
            }}
        )
        return recipes

    }


}





