import { Client,TLSConfig,TLSMode } from "https://deno.land/x/mysql/mod.ts"; 
const tlsConfig: TLSConfig = {
    mode: TLSMode.VERIFY_IDENTITY,
    caCerts: [
        await Deno.readTextFile("./DigiCertGlobalRootCA.crt.pem"),
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
export async function retrieveUser(id:string){
    const results=await connection.query(`CALL retrieve_user(?)`,[id])
    return results
}
export async function checkUsernameAvailability(username:string):Promise<usernameAvailabilty>{
    const results=await connection.query(`CALL check_username_availability(?)`,[username])
    return results[0]
}
export async function updateOauthUserUsername(username:string,userId:string){
    const results=await connection.query(`CALL update_oauthUser_username(?,?)`,[username,userId])
    return results
    
}
interface Recipe {
    uuid: string;
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
interface KenyanRecipe {
    uuid: string;
    recipe_name: string;
    page: number;
    about: string;
    ingredients: string;
    preparation: string;
    nutrition_per_100g: string;
    energy_kcal: number;
    fat_g: number;
    carbohydrates_g: number;
    proteins_g: number;
    fibre_g: number;
    vitamin_A_mcg: number;
    iron_mg: number;
    zinc_mg: number;
    F_factor_est: number;
    image_url: string;
    instructions: string;
    supplementary_ingredients: string;
    supplementary_instructions: string;
    parsedIngredientsList: string;
    no_of_ratings: number;
    recipe_rating: number;
  }
export interface Review{
    reviewText:string;
    recipeId:string;
    reviewerId:string
    region:string
}
export interface Rating{
    ratingNumber:number;
    recipeId:string;
    raterId:string
    region:string
}
export interface RecipeIntake{
    userId:string
    recipeId:string
    region:string
}
export interface foodIntake{
    userId:string
    foodId:string
}
export async function addRecipeIntake(recipeIntake:RecipeIntake){
    const results = await connection.query(`CALL ${recipeIntake.region=='kenyan'?'add_kenyan_recipe_intake(?,?)':'add_recipe_intake(?,?)'}`,[recipeIntake.userId,recipeIntake.recipeId]);
    return results
}
export async function addFoodIntake(recipeIntake:foodIntake){
    const results = await connection.query(`CALL 'add_food_intake(?,?)`,[recipeIntake.userId,recipeIntake.foodId]);
    return results
}
export async function findUserReviews(userId:string,region:string,next?:string){
    if(next){
        const results=await connection.query(`CALL ${region=='kenyan'?'get_user_paginated_kenyan_recipe_reviews(?,?)':'get_user_paginated_reviews(?,?)'}`,[userId,next])
        return results
    }
    else{
        const results=await connection.query(`CALL ${region=='kenyan'?'get_user_first_page_kenyan_recipe_reviews(?)':'get_user_first_page_reviews(?)'}`,[userId])
        return results
    }
}
export async function findUserRatings(userId:string,region:string,next?:string){
    if(next){
        const results=await connection.query(`CALL ${region=='kenyan'?'get_user_paginated_kenyan_recipe_ratings(?,?)':'get_user_paginated_ratings(?,?)'}`,[userId,next])
        return results
        
    }
    else{
        const results=await connection.query(`CALL ${region=='kenyan'?'get_user_first_page_kenyan_recipe_ratings(?)':'get_user_first_page_ratings(?)'}`,[userId])
        return results
    }
}
export async function findRecipeReviews(recipeId:string,region:string,number_of_results?:number,next?:string){
    if(next){
        const results=await connection.query(`CALL ${region=='kenyan'?'get_paginated_kenyan_recipe_reiews(?,?,?)':'get_paginated_reviews(?,?,?)'}`,[recipeId,number_of_results,next])
        return results
    }
    else{
        const results=await connection.query(`CALL ${region=='kenyan'?'get_first_page_kenyan_recipe_reviews(?,?)':'get_first_page_reviews(?,?)'}`,[recipeId,number_of_results])
        return results
    }
}
export async function addReview(review:Review):Promise<{task:string}>{
    const results = await connection.query(`CALL ${review.region=='kenyan'?'add_kenyan_recipe_review(?,?,?)':'add_recipe_review(?,?,?)'}`,[review.reviewText,review.recipeId,review.reviewerId]);
    
    return results[0]
}
export async function addRating(rating:Rating):Promise<{task:string}>{
    const results = await connection.query(`CALL ${rating.region=='kenyan'?'add_kenyan_recipe_rating(?,?,?)':'add_recipe_rating(?,?,?)'}`,[rating.ratingNumber,rating.recipeId,rating.raterId]);
    return results[0]
}
export async function getPaginatedRecipes(number_of_results:number,region:string,next?:string){
    if(next){
        const results=await connection.query(`CALL ${region=='kenyan'?'get_paginated_kenyan_recipes(?,?)':'get_paginated_recipes(?,?)'}`,[next,number_of_results])
        
        if(region=='worldwide'){
            let recipes:Recipe[]=results
            recipes=recipes.map((recipe)=>{
                return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
                }}
            )
            return recipes
        }
        else{
            let recipes:KenyanRecipe[]=results
            recipes=recipes.map((recipe)=>{
                return {...recipe,parsedIngredientsList:JSON.parse(recipe['parsedIngredientsList'])
                }}
            )
            return recipes

        }
          
    }
    else{
        const results=await connection.query(`CALL ${region=='kenyan'?'get_first_page_kenyan_recipes(?)':'get_first_page_recipes(?)'}`,[number_of_results])
        if(region=='worldwide'){
            let recipes:Recipe[]=results
            recipes=recipes.map((recipe)=>{
                return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
                }}
            )
            return recipes
        }
        else{
            let recipes:KenyanRecipe[]=results
            recipes=recipes.map((recipe)=>{
                return {...recipe,parsedIngredientsList:JSON.parse(recipe['parsedIngredientsList'])
                }}
            )
            return recipes

        }
        
    }
    
    
}

export async function findUserRecipeIntake(userId:string,region:string,next?:string){
    if(next){
        const results=await connection.query(`CALL ${region=='kenyan'?'get_user_paginated_kenyan_recipe_intake(?,?)':'get_user_paginated_recipe_intake(?,?)'}`,[userId,next])
        if(region=='worldwide'){
            let recipes:Recipe[]=results
            recipes=recipes.map((recipe)=>{
                return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
                }}
            )
            return recipes
        }
        else{
            let recipes:KenyanRecipe[]=results
            recipes=recipes.map((recipe)=>{
                return {...recipe,parsedIngredientsList:JSON.parse(recipe['parsedIngredientsList'])
                }}
            )
            return recipes

        }

    }
    else{
        const results=await connection.query(`CALL ${region=='kenyan'?'get_user_first_page_kenyan_recipe_intake(?)':'get_user_first_page_recipe_intake(?)'}`,[userId])
        if(region=='worldwide'){
            let recipes:Recipe[]=results
            recipes=recipes.map((recipe)=>{
                return {...recipe,ingredients:JSON.parse(recipe['ingredients']),directions:JSON.parse(recipe['directions']),NER:JSON.parse(recipe['NER'])
                }}
            )
            return recipes
        }
        else{
            let recipes:KenyanRecipe[]=results
            recipes=recipes.map((recipe)=>{
                return {...recipe,parsedIngredientsList:JSON.parse(recipe['parsedIngredientsList'])
                }}
            )
            return recipes

        }
    }   
}
export async function findUserFoodIntake(userId:string,next?:string){
    if(next){
        const results=await connection.query(`CALL get_user_paginated_food_intake(?,?)`,[userId,next])
        return results

    }
    else{
        const results=await connection.query(`CALL get_user_first_page_food_intake(?)`,[userId])
        return results
     
    }   
}