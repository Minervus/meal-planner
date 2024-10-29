//1. Import packages - express/axios/ejs/bodyparser
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

//2. Crearte express app and set port number
const app = express();
const port = 3000;
// MealDB API https://www.themealdb.com/api.php
const API_URL = "https://www.themealdb.com/api/json/v1/1/"; 

// Use BodyParser!
app.use(bodyParser.urlencoded({ extended: true }));


// Useful functions
function randomNumber(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

//3. Use public folder for static files
app.use(express.static("public"));

//4. Render homepage index.ejs
app.get("/", (req,res) => {
    res.render("index.ejs");
});

//5. Pull 4 recipes from the Meal API and push to index.ejs
// app.post("/submit", async (req,res) => {
//     //5.1 Pull list of recipes based on main ingredient
//     const mainIngredient = req.body.mainIngredient
//     const response = await axios.get(API_URL + "filter.php?i=" + mainIngredient);
//     //5.2 Choose one random recipe from the list and put into content
//     const mealsArray = response.data.meals;
//     const recipe = mealsArray[randomNumber(0,mealsArray.length)];
//     //5.3 Get recipe from API based on meal ID of random meal
//     // console.log(`Recipe: ${recipe}`)
//     console.log(`Recipe ID: ${recipe.idMeal}`)
//     const content = await axios.get(API_URL + "lookup.php?i=" + recipe.idMeal); 
//     console.log(content.data)
//     //5.4 Send recipe to frontend
//     res.render("index.ejs", { mondayContent: content.data.meals[0]});
// })

// Testing 'GENERATE ALL' 
// app.post("/submit", async (req,res) => {
//     const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
//     const weeklyIngredients = [];
//     const recipeContent = {}; 
//     weeklyIngredients.push(req.body.mondayIngredient);
//     weeklyIngredients.push(req.body.tuesdayIngredient);
//     weeklyIngredients.push(req.body.wednesdayIngredient);
//     weeklyIngredients.push(req.body.thursdayIngredient);
//     console.log(weeklyIngredients);

//     const promises = weeklyIngredients.map(async (ingredient, i) => {
//         for (let i=0; i<weeklyIngredients.length; i++) {
//             const mainIngredient = weeklyIngredients[i];
//             const response = await axios.get(API_URL + "filter.php?i=" + mainIngredient);
//             //5.2 Choose one random recipe from the list and put into content
//             const mealsArray = response.data.meals;
//             const recipe = mealsArray[randomNumber(0,mealsArray.length)];
//              //5.3 Get recipe from API based on meal ID of random meal
//             console.log(`Recipe: ${recipe}`)
//             console.log(`Recipe ID: ${recipe.idMeal}`)
//             const content = await axios.get(API_URL + "lookup.php?i=" + recipe.idMeal); 
//             console.log(content.data)
//             recipeContent[`meal${i}`] = content.data.meals[0];
//             await delay(1000); 
//         }

//     });

//     try {
//         const results = await Promise.all(promises);
//         //const recipeContent = Object.assign({}, ...results);

//         console.log(`RecipeContent Object: ${JSON.stringify(recipeContent)}`);
//         res.render("days.ejs", { 
//             mondayContent : recipeContent[0],
//             tuesdayContent : recipeContent[1],
//             wednesdayContent : recipeContent[2],
//             thursdayContent : recipeContent[3]
//          });

//     } catch (error) {
//         console.error("Failed to make request:", error.message);
//         res.render("index.ejs", {
//         error: error.message,
//         });
//     }
// })

// Perplexity suggestion
app.post("/submit", async (req, res) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const weeklyIngredients = [
        req.body.mondayIngredient,
        req.body.tuesdayIngredient,
        req.body.wednesdayIngredient,
        req.body.thursdayIngredient
    ];
    const recipeContent = {};

    try {
        for (let i = 0; i < weeklyIngredients.length; i++) {
            const mainIngredient = weeklyIngredients[i];
            const response = await axios.get(API_URL + "filter.php?i=" + mainIngredient);
            const mealsArray = response.data.meals;
            if (!mealsArray || mealsArray.length === 0) {
                throw new Error(`No meals found for ingredient: ${mainIngredient}`);
            }
            const recipe = mealsArray[randomNumber(0, mealsArray.length)];
            console.log(`Recipe: ${JSON.stringify(recipe)}`);
            console.log(`Recipe ID: ${recipe.idMeal}`);
            const content = await axios.get(API_URL + "lookup.php?i=" + recipe.idMeal);
            recipeContent[`meal${i}`] = content.data.meals[0];
            await delay(1000);
        }

        console.log(`RecipeContent Object: ${JSON.stringify(recipeContent)}`);
        console.log('Data being sent to EJS:', {
            mondayContent: recipeContent.meal0,
            tuesdayContent: recipeContent.meal1,
            wednesdayContent: recipeContent.meal2,
            thursdayContent: recipeContent.meal3
          });
        res.render("index.ejs", {
            mondayContent: recipeContent.meal0,
            tuesdayContent: recipeContent.meal1,
            wednesdayContent: recipeContent.meal2,
            thursdayContent: recipeContent.meal3
        });

    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message,
        });
    }
});


//6. Pull full list of ingredients from all recipes for the week

//7. Listen on port 3000 on server start
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
