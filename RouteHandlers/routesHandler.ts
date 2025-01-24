// @deno-types="npm:@types/express@4.17.15"
import {RequestHandler} from 'express'
import { checkAccessToken,checkRefreshToken, createAuthTokens } from "../auth/AuthTokens.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { addFoodIntake, addRating, addRecipeIntake, addReview, checkIfPasswordUserExists, checkUsernameAvailability, findRecipeReviews, findUserFoodIntake, getPaginatedRecipes, Rating, registerPasswordUser, Review, updateOauthUserUsername } from "../sqlDB/mysqlDB.ts";
import { findUserRatings } from "../sqlDB/mysqlDB.ts";
import { findUserReviews } from "../sqlDB/mysqlDB.ts";
import {findUserRecipeIntake} from '../sqlDB/mysqlDB.ts'

interface CheckAuthRequestBody{
    accessToken:string;
    refreshToken:string
}
interface RegisterRequestBody{
    username:string;
    email:string;
    password:string;
}
interface LoginRequestBody{
    username:string;
    password:string;
}
interface GetPaginatedRecipesBody{
    numberOfResults:number
    next?:string
    region:string
}
interface OauthAddUsernameBody{
    username:string
}
interface ReviewBody{
    reviewText:string
    recipeId:string;
    region:string

}
interface RatingBody{
    ratingNumber:number;
    recipeId:string;
    region:string
}
interface getReviewsBody{
    recipeId:string;
    numberOfResults:number;
    next?:string
    region:string
}
interface addRecipeIntakeBody{
    recipeId:string;
    region:string
}
interface addFoodIntakeBody{
    recipeId:string;
}
interface getUserReviewsBody{
    next?:string
    region:string
}
interface getUserRatingsBody{
    next?:string
    region:string

}
interface getUserFoodIntakeBody{
    next?:string

}
export const getUserRecipeIntakeHandler:RequestHandler=async (req,res)=>{
    const getUserRecipeIntakeInfo=<getUserRatingsBody>req.body
    try {
        if(getUserRecipeIntakeInfo.next){
            const results=await findUserRecipeIntake(req.userId,getUserRecipeIntakeInfo.region,getUserRecipeIntakeInfo.next)
            if(results.length>0){
                return res.json({results,next:results[results.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no user recipe intake available')
            }
        }
        else{
            const results=await findUserRecipeIntake(req.userId,getUserRecipeIntakeInfo.region)
            if(results.length>0){
                return res.json({results,next:results[results.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no user recipe intake available')
            }
        }
        
    } catch (error) {
        console.log('error at get user recipe intake',error)
        return res.status(404).send('an error occurred while retrieving user recipe intake,try again')    
    }
}
export const getUserFoodIntakeHandler:RequestHandler=async (req,res)=>{
    const getUserRecipeIntakeInfo=<getUserFoodIntakeBody>req.body
    try {
        if(getUserRecipeIntakeInfo.next){
            const results=await findUserFoodIntake(req.userId,getUserRecipeIntakeInfo.next)
            if(results.length>0){
                return res.json({results,next:results[results.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no user food intake available')
            }
        }
        else{
            const results=await findUserFoodIntake(req.userId)
            if(results.length>0){
                return res.json({results,next:results[results.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no user food intake available')
            }
        }
        
    } catch (error) {
        console.log('error at get user food intake',error)
        return res.status(404).send('an error occurred while retrieving user food intake,try again')    
    }
}
export const getUserRatingsHandler:RequestHandler=async (req,res)=>{
    const getUserRatingsInfo=<getUserRatingsBody>req.body
    try {
        if(getUserRatingsInfo.next){
            const results=await findUserRatings(req.userId,getUserRatingsInfo.region,getUserRatingsInfo.next)
            if(results.length>0){
                return res.json({results,next:results[results.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no user ratings available')
            }
        }
        else{
            const results=await findUserRatings(req.userId,getUserRatingsInfo.region)
            if(results.length>0){
                return res.json({results,next:results[results.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no user ratings available')
            }
        }
        
    } catch (error) {
        console.log('error at get user ratings',error)
        return res.status(404).send('an error occurred while retrieving user ratings,try again')    
    }
}
export const getUserReviewsHandler:RequestHandler=async (req,res)=>{
    const getUserReviewsInfo=<getUserReviewsBody>req.body
    try {
        if(getUserReviewsInfo.next){
            const results=await findUserReviews(req.userId,getUserReviewsInfo.region,getUserReviewsInfo.next)
            if(results.length>0){
                return res.json({results,next:results[results.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no user reviews available')
            }
        }
        else{
            const results=await findUserReviews(req.userId,getUserReviewsInfo.region)
            if(results.length>0){
                return res.json({results,next:results[results.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no user reviews available')
            }
        }
        
    } catch (error) {
        console.log('error at get user ratings',error)
        return res.status(404).send('an error occurred while retrieving user ratings,try again')    
    }
}
export const addRecipeIntakeHandler:RequestHandler=async (req,res)=>{
    const addRecipeIntakeInfo=<addRecipeIntakeBody>req.body
    if(!addRecipeIntakeInfo.recipeId){
        return res.status(404).send('provide recipe id')
    }
    try {
        const results=await addRecipeIntake({userId:req.userId,region:addRecipeIntakeInfo.region,recipeId:addRecipeIntakeInfo.recipeId})
        return res.json({...results,newTokens:req.newTokens})
    } catch (error) {
        console.log('error at add recipe intake',error)
        return res.status(404).send('an error occurred while adding recipe intake,try again')     
    }
}
export const addFoodIntakeHandler:RequestHandler=async (req,res)=>{
    const addRecipeIntakeInfo=<addFoodIntakeBody>req.body
    if(!addRecipeIntakeInfo.recipeId){
        return res.status(404).send('provide recipe id')
    }
    try {
        const results=await addFoodIntake({userId:req.userId,foodId:addRecipeIntakeInfo.recipeId})
        return res.json({...results,newTokens:req.newTokens})
    } catch (error) {
        console.log('error at add recipe intake',error)
        return res.status(404).send('an error occurred while adding recipe intake,try again')     
    }
}
export const getReviewsHandler:RequestHandler=async (req,res)=>{
    const getReviewsInfo=<getReviewsBody>req.body
    if(!getReviewsInfo.recipeId){
        return res.status(404).send('provide recipe id')
    }
    try {
        if(getReviewsInfo.numberOfResults&&getReviewsInfo.next){
            const reviews=await findRecipeReviews(getReviewsInfo.recipeId,getReviewsInfo.region,getReviewsInfo.numberOfResults,getReviewsInfo.next)
            console.log(reviews)
            if(reviews.length>0){
                return res.json({results:reviews,next:reviews[reviews.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no reviews available')
            }
        }
        else if(getReviewsInfo.numberOfResults&&!getReviewsInfo.next){
            const reviews=await findRecipeReviews(getReviewsInfo.recipeId,getReviewsInfo.region,getReviewsInfo.numberOfResults)
            if(reviews.length>0){
                return res.json({results:reviews,next:reviews[reviews.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no reviews available')
            }
        }
        else if(!getReviewsInfo.numberOfResults&&getReviewsInfo.next){
            const reviews=await findRecipeReviews(getReviewsInfo.recipeId,getReviewsInfo.region,5,getReviewsInfo.next)
            if(reviews.length>0){
                return res.json({results:reviews,next:reviews[reviews.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no reviews available')
            }
        }
        else{
            const reviews=await findRecipeReviews(getReviewsInfo.recipeId,getReviewsInfo.region,5)
            if(reviews.length>0){
                return res.json({results:reviews,next:reviews[reviews.length-1]['uuid'],newTokens:req.newTokens})
            }
            else{
                return res.send('no reviews available')
            }
        }
        
    } catch (error) {
        console.log('Error at retrieving reviews:',error)
        return res.status(404).send('an error occurred while retrieving reviews,try again')  
    }
}

export const addRecipeReviewHandler:RequestHandler=async (req,res)=>{
    const addReviewInfo=<ReviewBody>req.body
    if(!(addReviewInfo.reviewText&&addReviewInfo.recipeId)){
        return res.status(404).send('provide review text and recipe id')
    }
    try {
        const review:Review={
            reviewText:addReviewInfo.reviewText,
            recipeId:addReviewInfo.recipeId,
            reviewerId:req.userId,
            region:addReviewInfo.region
        }
        const addReviewResult=await addReview(review)
        if(addReviewResult.task=='not added'){
            return res.status(404).send('you already reviewed this recipe,want to update')
        }
        return res.json({...addReviewResult,newTokens:req.newTokens})
        
    } catch (error) {
        console.log('Error at adding a review',error)
        return res.status(404).send('an error occurred while adding review,try again')   
    }
}
export const addRecipeRatingHandler:RequestHandler=async (req,res)=>{
    const addRatingInfo=<RatingBody>req.body
    if(!(addRatingInfo.ratingNumber&&addRatingInfo.recipeId)){
        return res.status(404).send('provide rating number and recipe id')
    }
    try {
        const rating:Rating={
            ratingNumber:addRatingInfo.ratingNumber,
            recipeId:addRatingInfo.recipeId,
            raterId:req.userId,
            region:addRatingInfo.region
        }
        const addRatingResult=await addRating(rating)
        if(addRatingResult.task=='not added'){
            return res.status(404).send('you already rated this recipe,want to update')
        }
        return res.json({...addRatingResult,newTokens:req.newTokens})
        
    } catch (error) {
        console.log('Error at adding a rating:',error)
        return res.status(404).send('an error occurred while adding a rating,try again')
    }
}

export const addUsernameForOauthHandler:RequestHandler=async(req,res)=>{
    const oauthAddusernameInfo=<OauthAddUsernameBody>req.body
    if(!oauthAddusernameInfo.username){
        return res.status(404).send('provide username')
    }
    try {
        const usernameAvailabilty=await checkUsernameAvailability(oauthAddusernameInfo.username)
        if(usernameAvailabilty.status=='unavailable'){
            return res.status(404).send(`the username ${oauthAddusernameInfo.username} is already taken,choose another one`)
        }
        else{
            const user=await updateOauthUserUsername(oauthAddusernameInfo.username,req.userId)
            return res.json({...user,newTokens:req.newTokens})
        }
        
    } catch (error) {
        console.log('Error at addUsername:',error);
        return res.status(404).send('an error occurred while adding username,try again')
        
    }
}
export const fetchPaginatedRecipesHandler:RequestHandler=async(req,res)=>{
    const pageInfo=<GetPaginatedRecipesBody>req.body
    try {
        if(pageInfo.numberOfResults&&pageInfo.next){
            const recipes=await getPaginatedRecipes(pageInfo.numberOfResults,pageInfo.region,pageInfo.next)
            const recipesResponse={
                results:recipes,
                next:recipes[recipes.length-1]['uuid'],
                newTokens:req.newTokens
            }
            return res.json(recipesResponse)
        }
        else if(!pageInfo.numberOfResults&&pageInfo.next){
            const recipes=await getPaginatedRecipes(5,pageInfo.region,pageInfo.next)
            const recipesResponse={
                results:recipes,
                next:recipes[recipes.length-1]['uuid'],
                newTokens:req.newTokens
            }
            return res.json(recipesResponse)
        }
        else if(pageInfo.numberOfResults&&!pageInfo.next){
            const recipes=await getPaginatedRecipes(pageInfo.numberOfResults,pageInfo.region)
            const recipesResponse={
                results:recipes,
                next:recipes[recipes.length-1]['uuid'],
                newTokens:req.newTokens
            }
            return res.json(recipesResponse)
        }
        else{
            const recipes=await getPaginatedRecipes(5,pageInfo.region)
            const recipesResponse={
                results:recipes,
                next:recipes[recipes.length-1]['uuid'],
                newTokens:req.newTokens
            }
            return res.json(recipesResponse)
        }
        
    } catch (error) {
        
        console.log(error);
        return res.status(404).send('an errror occurred while retrieving recipes,try again')
        
    }
}

export const loginRouteHandler:RequestHandler=async (req,res)=>{
    try {
        const loginInfo=<LoginRequestBody>req.body
        if(!(loginInfo.username&& loginInfo.password)){
            return res.status(404).send('provide all fields:username,password')
        }
        const possibleUser=await checkIfPasswordUserExists(loginInfo.username)
        if(possibleUser.length==0){
            return res.status(404).send('no account with such username exists')
        }
        const hashedPassword=possibleUser[0]['hashed_password']
        const correctpassword=await bcrypt.compare(loginInfo.password,hashedPassword)
        if(!correctpassword){
            return res.status(404).send('wrong password')
        }
        const userInfo={
            id:possibleUser[0]['userId'],
            refreshTokenVersion:possibleUser[0]['refreshTokenversion'],
        }
        const userTokens=createAuthTokens(userInfo)
        return res.json(userTokens)

        
    } catch (error) {
        console.log('error at login',error)
        return res.status(404).send('an error occurred while logging in,try again')  
    }
}

export const registerRouteHandler:RequestHandler=async (req,res)=>{
    const registerInfo=<RegisterRequestBody>req.body
    if(!(registerInfo.username&&registerInfo.email&&registerInfo.password)){
        return res.status(404).send('provide all fields:username,email,password')
    }
    try {
        const possibleUser=await checkIfPasswordUserExists(registerInfo.username)
        if(possibleUser.length>0){
            return res.status(404).send('username already taken,choose another username')
        }
        const hashedPassword=await bcrypt.hash(registerInfo.password)
        const userObj={
            username:registerInfo.username,
            email:registerInfo.email,
            password:hashedPassword
        }
        const user=await registerPasswordUser(userObj)
        const registeredUser={
            id:user['userId'],
            refreshTokenVersion:0
        }
        const userTokens=createAuthTokens(registeredUser)
        return res.json(userTokens)
        
    } catch (error) {
        console.log('error at register route:',error)
        return res.status(404).send('an error occurred while registering,try again,') 
    }
}
export const checkAuthentication:RequestHandler=async (req,res,next)=>{
    const tokens=<CheckAuthRequestBody>req.body
    if(!(tokens.accessToken&& tokens.refreshToken)){
        return res.status(404).send('you have no access,log in or register')
    }
    const userData=checkAccessToken(tokens.accessToken)
    console.log('user data:',userData)
    if(userData=='unauthorized'){
      const refreshedUser=await checkRefreshToken(tokens.refreshToken)
      if(refreshedUser=='unauthorized'){
        return res.status(404).send('your credientials were revoked by principal account')
      }
      else{
        req.newTokens=refreshedUser.newTokens
        req.userId=refreshedUser.userId
        next()
      }
    }
    else{
      req.userId=userData.userId
      console.log(userData)
      next()
    }

}