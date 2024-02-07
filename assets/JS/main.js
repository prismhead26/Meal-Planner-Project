// const API_KEY = process.env.API_KEY

// const API_KEY = '4d568b90635e43f4a627b33131e5f540'
const API_KEY = '0e4952ee45974218818a782582391c14'
// const API_KEY = 'e755066ea6c044f4b71d08597fba8443';

const BASE_URL = 'https://api.spoonacular.com';
const recipeSearchPath = '/recipes/complexSearch';

const containerEl = document.getElementById('container');
const showMoreBtnEl = document.getElementById('showMore');
const generateResultsEl = document.getElementById('generateResults');
const dynamicBoxEl = document.getElementById('dynamicBox');
const clearDataEl = document.getElementById('clearData');
const backBtnEl = document.querySelector('.back-button');
const drinkContainerEl = document.querySelector('#drinkContainer');
const pastEl = document.getElementById('past')
const lastMealBtn = document.getElementById('secondUser')

showMoreBtnEl.setAttribute('style', 'display: none;');
// btn event listeners
showMoreBtnEl.addEventListener('click', showMoreMeals);
generateResultsEl.addEventListener('click', start);
dynamicBoxEl.addEventListener('click', checkIngredient);
generateResultsEl.addEventListener('click', animate);
clearDataEl.addEventListener('click', clearPastResults);
lastMealBtn.addEventListener('click', getHistory)
// checkbox listener
$('#randomDrinkCheckbox').change(checkBoxInit)

let offset = 0;
let totalResultCount = null;
const pageSize = 3;
const maxItems = 15;
//  create empty user obj
const user = {
  includeIngredients: []
};
// create default parameters for the food api
const DEFAULT_PARAMETERS = {
  apiKey: API_KEY,
  instructionsRequired: true,
  addRecipeInformation: true,
  number: pageSize,
};
// create dropdown btns and add user input to userObj
function toggleIngredientButtons() {
  const dietType = document.getElementById('dietType').value;
  // creates key:value pair for user obj
  user.diet = dietType;
  document.querySelectorAll('.ingredient-button').forEach((button) => {
    const buttonD = button.dataset.diet.split(',');
    if (dietType === 'common') {
      button.style.display = 'inline-block';
    } else if (buttonD.includes(dietType)) {
      button.style.display = 'inline-block';
    } else {
      button.style.display = 'none';
    }
  });
}

function toggleSelection(button) {
  button.classList.toggle('selected');
}
// build query strings based of the key:value pair for user + default params
function buildParamterString(params) {
  // Covert object to array of arrays
  // Replace each array item with string 'key=value'
  // Join array of strings together with '&'
  return Object.entries(params)
    .map((paramKeyValue) => {
      const [key, value] = paramKeyValue;
      return `${key}=${value}`;
    }).join('&');
}
function setAttr() {
  showMoreBtnEl.setAttribute('style', 'display: show;');
  generateResultsEl.setAttribute('style', 'display: none;');
  backBtnEl.setAttribute('style', 'display: none;');
  drinkContainerEl.setAttribute('style', 'display: show;');
}
// main function to fetch meal data based on params
function searchRecipies(cuisineType, dietType, includeIngredientsType) {


  const params = {
      cuisine: cuisineType,
      diet: dietType,
      includeIngredients: includeIngredientsType,
      offset,

      ...DEFAULT_PARAMETERS,
  };
  console.log('Params: ', params);
  const url = `${BASE_URL}${recipeSearchPath}?${buildParamterString(params)}`;
  fetch(url)
      .then((res) => res.json())
      .then((data) => {
          console.log(data);
          if (data.totalResults === 0) {
              containerEl.innerHTML = `${containerEl.innerHTML}<p style="color: red;" >No meals found! Try again.</p>`;
              showMoreBtnEl.setAttribute('style', 'display: none;');
              return;
          }

          // Create a new container for recipes if total displayed recipes < 6
          if (containerEl.querySelectorAll('.recipe-container').length < 2) {
              const recipeContainer = document.createElement('div');
              recipeContainer.classList.add('recipe-container', 'has-background-primary');

              // Loop through the data and generate recipe content
              let textContent = '';
              for (let i = 0; i < data.results.length; i++) {
                  // Generate content for each recipe
                  const meal = data.results[i];
                  const mealTitle = meal.title;
                  const imagesrc = meal.image;
                  // destructiring assignment --- destructuring data obj and create var based on data
                  const { readyInMinutes } = meal;
                  const { servings } = meal;
                  const instructions = meal.spoonacularSourceUrl;

                  textContent += `
                      <div id="mealInfo" class="m-3 is-size-6">
                          <h1>Meal: ${mealTitle}</h1>
                          <img src="${imagesrc}" alt="food image" class= "image is-128x128"></img>
                          <p class="has-text-primary">Ready in ${readyInMinutes} minutes</p>
                          <p class="has-text-primary">Servings: ${servings}</p> 
                          <a target="_blank" rel="noopener" href='${instructions}' class="foodLink has-text-centered">Instructions Link</a>
                      </div>
                  `;
              }

              // Append the recipe content to the recipe container
              recipeContainer.innerHTML = textContent;

              // Append the recipe container to the containerEl
              containerEl.appendChild(recipeContainer);
          }

          totalResultCount = data.totalResults;
          console.log('current user obj', user)
          localStorage.setItem('pastResults', JSON.stringify(user))
          // Hide "Show More" button if total displayed recipes >= 6
          if (containerEl.querySelectorAll('.recipe-container').length >= 2) {
              showMoreBtnEl.setAttribute('style', 'display: none;');
          }
      })
      .catch((err) => console.log('Failed to load', err));
}

function getHistory() {
  lastMealBtn.disabled = true
  createDrink()
  showIngredients()
  showNewMealButton()
  const lastMeal = JSON.parse(localStorage.getItem('pastResults'))
  setAttr()
  searchRecipies(lastMeal.cuisine, lastMeal.diet, lastMeal.includeIngredients)
}
// showMoreMeals increasing the offset of the data until data runs out
function showMoreMeals() {
  offset += 3;

  searchRecipies(user.cuisine, user.diet, user.includeIngredients);
  if (offset >= totalResultCount - pageSize) {
    showMoreBtnEl.setAttribute('style', 'display: none;');
  } else {
    console.assert(offset % 3 === 0, 'Remainder !=0');
  }
}
// create user key:value pair
function searchWithIngredient(ingredient) {
  user.includeIngredients.push(ingredient)
}
// create user key:value pair
function selectCuisine(userCuisine) {
  if (localStorage.getItem('pastResults')) lastMealBtn.setAttribute('style', 'display: none;')
  user.cuisine = userCuisine;
  const cuisineButtons = document.querySelectorAll('.cuisine-button');
  cuisineButtons.forEach(button => {
    button.classList.remove('selected'); // Remove 'selected' class from all cuisine buttons
  });
  event.target.classList.add('selected'); // Add 'selected' class to the clicked cuisine button
}
// remove newly created elements with btn to reset application
function clearPastResults() {
  $('.mealData').removeClass();
  $('.drinkData').removeClass();
  offset = 0;
  totalResultCount = null;
}
// init function with guard statement to ensure user selects all btns
function start() {
  if (!user.hasOwnProperty('cuisine') || !user.hasOwnProperty('diet') || !user.hasOwnProperty('includeIngredients')) {
    return $('#warning').text('Must select a choice for each type!')
  }
  $('#warning').text('')
  // clearPastResults()
  setAttr()
  searchRecipies(user.cuisine, user.diet, user.includeIngredients);
}
// init function for fetching cocktail data through checkbot
function checkBoxInit() {
  if (!this.checked) {
    } else {
      drinkContainerEl.innerHTML = ''
      localStorage.removeItem('pastResultsCocktail');
      createDrink();
    }
};

// gets a fun random cocktail
function createDrink() {
  // const lastDrink = 12474
  if (localStorage.getItem('pastResultsCocktail') !== null) {
    let lastDrink = localStorage.getItem('pastResultsCocktail')
    lastDrink = lastDrink.slice(1, -1);
    console.log(lastDrink)
    var drinkUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${lastDrink}`
  } else {
    drinkUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
  }
  // const drinkUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
  fetch(drinkUrl)
    .then((res) => res.json())
    .then((data) => {
      const drinkData = data.drinks[0];
      const drinkId = drinkData.idDrink
      const drinkTitle = drinkData.strDrink;
      const imagesrc = drinkData.strDrinkThumb;
      const drinkInstructions = drinkData.strInstructions;
      const strIngredient = 'strIngredient'
      let ingredientText = ''
        for(let i = 1; i < maxItems; i++) {
          let string = strIngredient + i
          if (drinkData[string] !== null) {
            ingredientText += (`<li class="has-text-primary">${drinkData[string]}</li>`)
          }
        }
      const strMeasure = 'strMeasure'
      let measureText = ''
        for(let i = 1; i < maxItems; i++) {
          let string = strMeasure + i
          if (drinkData[string] !== null) {
            measureText += (`<li class="has-text-primary">${drinkData[string]}</li>`)
          }
        }
      const textContent = `
        <h1>${drinkTitle}</h1>
        <img src="${imagesrc}" alt="cocktail image" class= "image is-128x128 is-justify-content-center"></img>
        <p class="has-text-primary">Instructions: ${drinkInstructions}</p>
        <div class="column">
        <li class="has-text-primary style="color: #77ccae;">Ingredients: ${ingredientText}</li>
        </div>
        <div class="column">
        <li class="has-text-primary">Measurements: ${measureText}</li>
        </div>
    `;
      const rowContent = `<section class="drinkData" class="row" >${textContent}</section>`;
      drinkContainerEl.innerHTML += rowContent;
      drinkContainerEl.setAttribute('style','display: none;')
      localStorage.setItem('pastResultsCocktail', JSON.stringify(drinkId))
    });
}
// target selector for ingredient btns
function checkIngredient(event) {
  if (event.target.classList.contains('ingredient-button')) {
    toggleSelection(event.target);
  }
}
// animate application container
function animate(e) {
  e.preventDefault();
  if (!user.hasOwnProperty('diet') || !user.hasOwnProperty('includeIngredients')) {
    return;
  }
  };

  if (!localStorage.getItem('pastResults')) lastMealBtn.setAttribute('style', 'display: none;')
