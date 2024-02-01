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
}

function toggleIngredientButtons() {
    const dietType = document.getElementById('dietType').value;
    console.log("Selected diet type:", dietType);
    // creates key:value pair for user obj
    user["diet"] = dietType;
    console.log(JSON.stringify(user.diet.split('"')));
    document.querySelectorAll('.ingredient-button').forEach(button => {
        const buttonD = button.dataset.diet.split(',');
        console.log("Button diets:", buttonD);
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

function searchRecipies(cuisineType, dietType, includeIngredientsType, numResults) {
    const params = {
        cuisine: cuisineType,
        diet: dietType,
        includeIngredients: includeIngredientsType,
        number: numResults,

        ...DEFAULT_PARAMETERS
    }
    const url = `${BASE_URL}${recipeSearchPath}?${buildParamterString(params)}`
    fetch(url)
    .then(res => res.json())
    // data results
    .then((data) => {
        console.log(data)
        const mealTitle = data.results[0].title
        document.getElementById('mealData').innerHTML = `
        <h1>${mealTitle}</h1>
        <img src="" alt="food image"></img>
        <h3></h3>
        <li>Ingredients: </li>
        <p>Ready in  minutes</p>
        <p>Servings:  </p> 
        <a>Instructions Link</a>
    `;
    })
}


// searchRecipies('american', '', 'eggs,cheese', 3)

function searchWithIngredient(ingredient) {
    searchRecipies('', '', ingredient, 1)
}

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
    $('#dynamicBox').animate({
        'margin-left' : '-900px'
    });                 
});

GetDrink()