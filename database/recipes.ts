import mongoist from 'mongoist'
import MongoPaging from 'mongo-cursor-pagination'
const MONGODB_URI = Deno.env.get("MONGODB_URI") || "";
console.log(MONGODB_URI)
const recipesdb = mongoist(`${MONGODB_URI}/recipes`);
const kenyanRecipes=recipesdb.collection('Kenyan_recipes_combined')
const worldwideRecipes=recipesdb.collection('sample_2M_recipes')


type PaginatedResult={
    next:string,
    results:[]
    hasNext:boolean,
    previous?:string
}

async function getPaginatedRecipes(collectionName:string,next?:string):Promise<PaginatedResult>{
    if (next){
        const result = await MongoPaging.find(collectionName=='Worldwide'?worldwideRecipes:kenyanRecipes, {
            limit: 5,
            next: next,
            sortAscending:true // This queries the next page
          });
        return result
    }
    else{
        const result = await MongoPaging.find(collectionName=='Worldwide'?worldwideRecipes:kenyanRecipes, {
            limit: 5,
            sortAscending:true
            });
        return result   
    }

}

// getPaginatedRecipes('Kenyan').then(
//     (result)=>{
//         getPaginatedRecipes('Kenyan',result.next).then()

//     }
// )
export {getPaginatedRecipes}
