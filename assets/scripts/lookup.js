const urlParams = new URLSearchParams(window.location.search);
const OPEN_FOOD_URL_BASE = "https://world.openfoodfacts.net/api/v2/product";

const productTitleElem = document.querySelector("#product-title");
const energyElem = document.querySelector("#energy");
const energy100Elem = document.querySelector("#energy-100");
const productImageElem = document.querySelector("#product-image");
const servingElem = document.querySelector("#serving");
const servingUnitElem = document.querySelector("#serving-unit")

const loadProduct = async() => {
    const codFromParams = urlParams.get("cod");
    let product = await fetch(OPEN_FOOD_URL_BASE + "/" + codFromParams)
    product = await product.json();

    const productTitle = product.product.product_name;
    productTitleElem.innerText = productTitle

    const nutriments = product.product.nutriments;
    energyElem.innerText = nutriments["energy-kcal"] + nutriments["energy-kcal_unit"];
    energy100Elem.innerText = nutriments["energy-kcal_100g"] + nutriments["energy-kcal_unit"];
    productImageElem.src = product.product.image_url

    const serving = product.product["serving_quantity"]
    if(serving) {
        servingElem.innerText = serving;
        servingUnitElem.innerText = product.product["serving_quantity_unit"]
        energyElem.innerText = nutriments["energy-kcal_serving"] + nutriments["energy-kcal_unit"];
    }
}

window.onload = loadProduct()
