// const API_KEY = process.env.API_KEY 
const API_KEY = '4d568b90635e43f4a627b33131e5f540'
// const API_KEY = '0e4952ee45974218818a782582391c14'
// const API_KEY = 'e755066ea6c044f4b71d08597fba8443'

const BASE_URL = 'https://api.spoonacular.com'
const recipeSearchPath = '/recipes/complexSearch'

var user = {
    // cuisine: 'american',
    // diet: document.getElementById('dietType').value,
    // ingredients: 'eggs'
};

// function createMeal(cuisine, diet, ingredients) {
//     searchRecipes(cuisine, diet, ingredients, 5)
// }

// const createMeal = user => createMeal(cuisine(user))(diet(user));

const DEFAULT_PARAMETERS = {
    apiKey: API_KEY,
    instructionsRequired: true,
    addRecipeInformation: true,
    number: 3,
}

function toggleIngredientButtons() {
    const dietType = document.getElementById('dietType').value;
    console.log("Selected diet type:", dietType);
    // creates key:value pair for user obj
    user["diet"] = dietType;
    console.log(user.diet);
    document.querySelectorAll('.ingredient-button').forEach(button => {
        const buttonD = button.dataset.diet.split(',');
        // console.log("Button diets:", buttonD);
        if (dietType === 'common') {
            button.style.display = 'inline-block';
        } else {
            if (buttonD.includes(dietType)){
                button.style.display = 'inline-block';
            } else {
                button.style.display = 'none';
            }
        }
    });
}

function toggleSelection(button) {
    button.classList.toggle('selected');
}

function buildParamterString(params) {
    // Covert object to array of arrays
    // Replace each array item with string 'key=value'
    // Join array of strings together with '&'
    return Object.entries(params)
        .map((paramKeyValue) => {
            let [key, value] = paramKeyValue
            return `${key}=${value}`
        }).join('&')
}

function searchRecipies(cuisineType, dietType, includeIngredientsType) {
    const params = {
        cuisine: cuisineType,
        diet: dietType,
        includeIngredients: includeIngredientsType,

        ...DEFAULT_PARAMETERS
    }
    const url = `${BASE_URL}${recipeSearchPath}?${buildParamterString(params)}`
    fetch(url)
    .then(res => res.json())
    // data results
    .then((data) => {
        console.log(data)

        // for loop runs through all results and displays via DOM per div:mealInfo
        let textContent = '';
        for (let i = 0; i < data.results.length; i ++) {
        // get meal information from data
        const mealTitle = data.results[i].title
        const imagesrc = data.results[i].image
        const readyInMinutes = data.results[i].readyInMinutes
        const servings = data.results[i].servings
        const instructions = data.results[i].spoonacularSourceUrl

        textContent += `
        <div id="mealInfo">
            <h1>${mealTitle}</h1>
            <img src="${imagesrc}" alt="food image"></img>
            <h3></h3>
            <li>Ingredients: </li>
            <p>Ready in ${readyInMinutes} minutes</p>
            <p>Servings: ${servings}</p> 
            <a href='${instructions}'>Instructions Link</a>
        </div>
    `;
        }
        document.getElementById('mealData').innerHTML = textContent
    })
        //  catches error for if any .then fails, it will return an error
        .catch((err) => console.log('Failed to load', err));
}

function searchWithIngredient(ingredient) {
    user["includeIngredients"] = ingredient
    console.log('user ingredient: ',user.includeIngredients)
    // searchRecipies('', '', ingredient, 2)
}

document.getElementById('generateResults').addEventListener('click', () => {
    if (!user.hasOwnProperty('diet' || 'includeIngredients')) {
        return
    }
    searchRecipies('', user.diet, user.includeIngredients)
})

// gets a fun random cocktail
function GetDrink() {
    const drinkUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
    fetch(drinkUrl)
    .then (res => res.json())
    .then(console.log)
}

// Event listener to select ingredient buttons
document.getElementById('dynamicBox').addEventListener('click', function(event) {
    if (event.target.classList.contains('ingredient-button')) {
        toggleSelection(event.target);
    }
});

$('#generateResults').click(function(e) {
    e.preventDefault();
    if (!user.hasOwnProperty('diet' || 'includeIngredients')) {
        return
    }
    $('#dynamicBox').animate({
        'margin-left' : '-900px'
    });                 
});

GetDrink()