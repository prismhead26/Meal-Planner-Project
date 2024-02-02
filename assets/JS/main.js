// const API_KEY = process.env.API_KEY

// const API_KEY = '4d568b90635e43f4a627b33131e5f540'
// const API_KEY = '0e4952ee45974218818a782582391c14'
const API_KEY = 'e755066ea6c044f4b71d08597fba8443';

const BASE_URL = 'https://api.spoonacular.com';
const recipeSearchPath = '/recipes/complexSearch';

const containerEl = document.getElementById('container');
const showMoreBtnEl = document.getElementById('showMore');
const generateResultsEl = document.getElementById('generateResults');
const dynamicBoxEl = document.getElementById('dynamicBox');
// const cuisineBoxEl = document.getElementById('cuisineBox');
const clearDataEl = document.getElementById('clearData');
const backBtnEl = document.querySelector('.back-button');
const drinkContainerEl = document.querySelector('#drinkContainer');

showMoreBtnEl.setAttribute('style', 'display: none;');

showMoreBtnEl.addEventListener('click', showMoreMeals);
generateResultsEl.addEventListener('click', start);
dynamicBoxEl.addEventListener('click', checkIngredient);
generateResultsEl.addEventListener('click', animate);
clearDataEl.addEventListener('click', clearPastResults);

let offset = 0;
let totalResultCount = null;
const pageSize = 3;
const maxItems = 15;

const user = {
};

const DEFAULT_PARAMETERS = {
  apiKey: API_KEY,
  instructionsRequired: true,
  addRecipeInformation: true,
  number: pageSize,
};

function toggleIngredientButtons() {
  const dietType = document.getElementById('dietType').value;
  console.log('Selected diet type:', dietType);
  // creates key:value pair for user obj
  user.diet = dietType;
  console.log(user.diet);
  document.querySelectorAll('.ingredient-button').forEach((button) => {
    const buttonD = button.dataset.diet.split(',');
    // console.log("Button diets:", buttonD);
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

function searchRecipies(cuisineType, dietType, includeIngredientsType) {
  showMoreBtnEl.setAttribute('style', 'display: show;');
  generateResultsEl.setAttribute('style', 'display: none;');
  backBtnEl.setAttribute('style', 'display: none;');

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
    // data results
    .then((data) => {
      console.log(data);
      if (data.totalResults === 0) {
        containerEl.innerHTML = `${containerEl.innerHTML}<p style="color: red;" >No meals found! Try again.</p>`;
        showMoreBtnEl.setAttribute('style', 'display: none;');
        return;
      }

      // for loop runs through all results and displays via DOM per div:mealInfo
      let textContent = '';
      for (let i = 0; i < data.results.length; i++) {
        // get meal information from data
        const meal = data.results[i];
        const mealTitle = meal.title;
        const imagesrc = meal.image;
        const { readyInMinutes } = meal;
        const { servings } = meal;
        const instructions = meal.spoonacularSourceUrl;

        textContent += `
                <div id="mealInfo" class="m-3 is-size-6">
                    <h1>Meal: ${mealTitle}</h1>
                    <img src="${imagesrc}" alt="food image" class= "image is-128x128"></img>
                    <p>Ready in ${readyInMinutes} minutes</p>
                    <p>Servings: ${servings}</p> 
                    <a href='${instructions}'>Instructions Link</a>
                </div>
            `;
      }
      const rowContent = `<section class="mealData" class="columns" >${textContent}</section>`;
      containerEl.innerHTML += rowContent;
      totalResultCount = data.totalResults;
    })
    //  catches error for if any .then fails, it will return an error
    .catch((err) => console.log('Failed to load', err));
}

function showMoreMeals() {
  offset += 3;
  console.log('offset: ', offset);
  console.log('totalResultCount: ', totalResultCount);
  searchRecipies(user.cuisine, user.diet, user.includeIngredients);
  if (offset >= totalResultCount - pageSize) {
    showMoreBtnEl.setAttribute('style', 'display: none;');
  } else {
    console.assert(offset % 3 === 0, 'Remainder !=0');
  }
}

function searchWithIngredient(ingredient) {
  user.includeIngredients = ingredient;
  console.log('user ingredient: ', user.includeIngredients);
}

function selectCuisine(userCuisine) {
  user.cuisine = userCuisine;

  console.log('user cuisine: ', user.cuisine);
}

function clearPastResults() {
  $('.mealData').removeClass();
  $('.drinkData').removeClass();
  offset = 0;
  totalResultCount = null;
}

function start() {
  if (!user.hasOwnProperty('diet') || !user.hasOwnProperty('includeIngredients')) {
    return;
  }
  // clearPastResults()
  searchRecipies(user.cuisine, user.diet, user.includeIngredients);
}

$(document).ready(function () {
  // set initial state.
  $('#randomDrinkCheckbox').val(this.checked);

  $('#randomDrinkCheckbox').change(function () {
    if (!this.checked) {
      $('.drinkData').removeClass();
    } else {
      $(this).prop('checked');
      createDrink();
    }
    // $('#randomDrinkCheckbox').val(!this.checked);
  });
});

// gets a fun random cocktail
function createDrink() {
  const drinkUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
  fetch(drinkUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log('drink obj: ', data);
      console.log('drink Title: ', data.drinks[0].strDrink);
      const drinkData = data.drinks[0];
      const drinkTitle = drinkData.strDrink;
      const imagesrc = drinkData.strDrinkThumb;
      const drinkInstructions = drinkData.strInstructions;
      const strIngredient = 'strIngredient'
      let ingredientText = ''
        for(let i = 1; i < maxItems; i++) {
          let string = strIngredient + i
          if (drinkData[string] !== null) {
            // console.log('ingredient number: ',i)
            // console.log('ingredient: ',drinkData[string])
            ingredientText += ( drinkData[string] + ', ')
          }

        }
      const strMeasure = 'strMeasure'
      let measureText = ''
        for(let i = 1; i < maxItems; i++) {
          let string = strMeasure + i
          if (drinkData[string] !== null) {
            // console.log('ingredient number: ',i)
            // console.log('measure: ',drinkData[string])
            measureText += ( drinkData[string] + ', ')
          }

        }
      const textContent = `
        <h1>${drinkTitle}</h1>
        <img src="${imagesrc}" alt="cocktail image" style="max-Width: 15%;"></img>
        <p>Instructions: ${drinkInstructions}</p>
        <li>Ingredients: ${ingredientText}</li>
        <li>Measurements: ${measureText}</li>
    `;
      const rowContent = `<section class="drinkData" class="row" >${textContent}</section>`;
      drinkContainerEl.innerHTML += rowContent;
    });
}

function checkIngredient(event) {
  if (event.target.classList.contains('ingredient-button')) {
    toggleSelection(event.target);
  }
}

function animate(e) {
  e.preventDefault();
  if (!user.hasOwnProperty('diet') || !user.hasOwnProperty('includeIngredients')) {
    return;
  }
  $('#dynamicBox').animate({
    // 'margin-left' : '-900px'
  });
}
