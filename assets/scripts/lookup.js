const OPEN_FOOD_URL_BASE = "https://world.openfoodfacts.net/api/v2/product";
const urlParams = new URLSearchParams(window.location.search);
const productTitleElem = document.querySelector("#product-title");
const energyElem = document.querySelector("#energy");
const energy100Elem = document.querySelector("#energy-100");
const productImageElem = document.querySelector("#product-image");
const servingElem = document.querySelector("#serving");
const servingUnitElem = document.querySelector("#serving-unit");

const fetchProductData = async (code) => {
    const response = await fetch(`${OPEN_FOOD_URL_BASE}/${code}`);
    return response.json();
};

const updateProductDetails = (product) => {
    const productTitle = product.product.product_name;
    productTitleElem.innerText = productTitle;

    const nutriments = product.product.nutriments;
    const energyUnit = nutriments["energy-kcal_unit"];
    
    energyElem.innerText = nutriments["energy-kcal"] + energyUnit;
    energy100Elem.innerText = nutriments["energy-kcal_100g"] + energyUnit;
    productImageElem.src = product.product.image_url;

    const serving = product.product["serving_quantity"];
    if (serving) {
        servingElem.innerText = serving;
        servingUnitElem.innerText = product.product["serving_quantity_unit"];
        energyElem.innerText = nutriments["energy-kcal_serving"] + energyUnit;
    }
};

const loadProduct = async () => {
    const codFromParams = urlParams.get("cod");
    if (codFromParams) {
        const product = await fetchProductData(codFromParams);
        updateProductDetails(product);
    }
};

window.onload = loadProduct;
