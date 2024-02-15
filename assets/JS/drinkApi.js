// drinkApi contains all functions related to retrieving drinkData

// gets a fun random cocktail
function createDrink() {
    drinkContainerEl.innerHTML = ''
    let drinkUrl;
    if (localStorage.getItem('pastResultsCocktail') !== null) {
        let lastDrink = localStorage.getItem('pastResultsCocktail')
        lastDrink = lastDrink.slice(1, -1);
        console.log(lastDrink)
        drinkUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${lastDrink}`
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
            localStorage.setItem('pastResultsCocktail', JSON.stringify(drinkId))
        });
  }