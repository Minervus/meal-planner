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
app.post("/submit", async (req,res) => {
    //5.1 Pull list of recipes based on main ingredient
    const mainIngredient = req.body.mainIngredient
    const response = await axios.get(API_URL + "filter.php?i=" + mainIngredient);
    //5.2 Choose one random recipe from the list and put into content
    const mealsArray = response.data.meals;
    const recipe = mealsArray[randomNumber(0,mealsArray.length)];
    //5.3 Get recipe from API based on meal ID of random meal
    // console.log(`Recipe: ${recipe}`)
    // console.log(`Recipe ID: ${recipe.idMeal}`)
    const content = await axios.get(API_URL + "lookup.php?i=" + recipe.idMeal); 
    console.log(content.data)
    //5.4 Send recipe to frontend
    res.render("index.ejs", { content: content.data.meals[0]});

})





//6. Pull full list of ingredients from all recipes for the week

//7. Listen on port 3000 on server start
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
