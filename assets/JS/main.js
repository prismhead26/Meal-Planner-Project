// MAIN.JS containts button, etc. implementation as well as history
const containerEl = document.getElementById('container');
const showMoreBtnEl = document.getElementById('showMore');
const dynamicBoxEl = document.getElementById('dynamicBox');
const clearDataEl = document.getElementById('clearData');
const backBtnEl = document.querySelector('.back-button');
const drinkContainerEl = document.querySelector('#drinkContainer');
const pastEl = document.getElementById('past')
const lastMealBtn = document.getElementById('secondUser')

showMoreBtnEl.setAttribute('style', 'display: none;');
// btn event listeners
// showMoreBtnEl.addEventListener('click', showMoreMeals);
dynamicBoxEl.addEventListener('click', checkIngredient);
clearDataEl.addEventListener('click', clearPastResults);
lastMealBtn.addEventListener('click', getHistory)
// checkbox listener
$('#randomDrinkCheckbox').change(checkBoxInit)
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
function setBoxSize() {
  const box = document.getElementById('dynamicBox')
  const totalHeight = array.from(box.children).reduce((acc, child) => {
      return acc + child.offsetHeight;
  }, 0);
  box.style.minHeight = totalHeight + 'px';
}

function showIngredients() {
  if (!user.hasOwnProperty('cuisine')) {
  // Display warning message if cuisine is not selected
  document.getElementById('cuisineWarning').style.display = 'block';
  return; 
}
  document.getElementById('cuisineWarning').style.display = 'none';
  document.getElementById('cuisineBox').style.display = 'none';
  document.getElementById('dynamicBox').style.display = 'block';          
}

function goBack() {
  document.getElementById('dynamicBox').style.display = 'none';
  document.getElementById('cuisineBox').style.display = 'block';
}

function showNewMealButton() {
  const newMealButton = document.getElementById('clearData');
  newMealButton.style.display = 'block';
}

function getHistory() {
  lastMealBtn.disabled = true;
  showIngredients();
  showNewMealButton();
  const lastMeal = JSON.parse(localStorage.getItem('pastResults'));
  // Hide cuisineBox and show dynamicBox
  document.getElementById('cuisineBox').style.display = 'none';
  document.getElementById('dynamicBox').style.display = 'block';
  searchRecipies(lastMeal.cuisine, lastMeal.diet, lastMeal.includeIngredients);
}
// remove newly created elements with btn to reset application
function clearPastResults() {
  $('.mealData').removeClass();
  $('.drinkData').removeClass();
  offset = 0;
  totalResultCount = null;
}
// init function for fetching cocktail data through checkbot
function checkBoxInit() {
  if (!this.checked) {
    return;
    }
      drinkContainerEl.innerHTML = ''
      localStorage.removeItem('pastResultsCocktail');
    
};
// target selector for ingredient btns
function checkIngredient(event) {
  if (event.target.classList.contains('ingredient-button')) {
    toggleSelection(event.target);
  }
}
