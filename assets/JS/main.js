// const API_KEY = process.env.API_KEY 
const API_KEY = '4d568b90635e43f4a627b33131e5f540' 

const BASE_URL = 'https://api.spoonacular.com'
const recipeSearchPath = '/recipes/complexSearch'

const DEFAULT_PARAMETERS = {
    apiKey: API_KEY,
    instructionsRequired: true,
    addRecipeInformation: true,
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

function searchRecipies(searchText, dietType) {
    const params = {
        diet: dietType,
        query: searchText,
        ...DEFAULT_PARAMETERS
    }
    const url = `${BASE_URL}${recipeSearchPath}?${buildParamterString(params)}`
    fetch(url)
    .then(res => res.json())
    // data results
    .then(console.log)
}

searchRecipies('pasta', 'vegetarian')