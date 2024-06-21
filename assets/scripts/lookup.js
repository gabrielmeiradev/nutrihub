const OPEN_FOOD_URL_BASE = "https://world.openfoodfacts.org/api/v3/product";
const urlParams = new URLSearchParams(window.location.search);
const productTitleElem = document.querySelector("#product-title");
const energyElem = document.querySelector("#energy");
const energy100Elem = document.querySelector("#energy-100");
const productImageElem = document.querySelector("#product-image");
const servingElem = document.querySelector("#serving");
const servingUnitElem = document.querySelector("#serving-unit");

const proteinasElem = document.querySelector("#proteinas");
const carboElem = document.querySelector("#carbo");
const lipElem = document.querySelector("#lip");

const proteinMacroElem = document.querySelector("#protein-macro");
const carboMacroElem = document.querySelector("#carbo-macro");
const lipMacroElem = document.querySelector("#lip-macro");

const consumedQuantityInput = document.querySelector("#consumed-quantity-input");
const totalConsumedKcalElem = document.querySelector("#total-consumed-kcal-value");
const totalConsumedKcalUnitElem = document.querySelector("#total-consumed-kcal-unit");

let productData = {}; 
const productToSave = {
    title: "",
    carbo: "",
    proteins: "",
    fat: "",
    energy: 0,
    image: ""
}

const fetchProductData = async (code) => {
    const response = await fetch(`${OPEN_FOOD_URL_BASE}/${code}`);
    if (!response.ok) {
        alert("Houve um erro ao ler, tente novamente");
        location.href = "/";
    }
    return response.json();
};

const formatValue = value => (value % 1 === 0 ? parseInt(value) : value.toFixed(1));

const updateProductDetails = (consumedQuantity = 100) => {
    consumedQuantityInput.textContent = consumedQuantity;

    productTitleElem.innerText = productData.product_name;

    const nutriments = productData.nutriments;

    const energyValue =  nutriments["energy-kcal"] || nutriments["energy-kj"] / 4.2;

    productToSave.energy = energyValue;

    energyElem.innerText = energyValue + "kcal";

    servingElem.innerText = productData.quantity;
    servingUnitElem.innerText = "g";

    productImageElem.src = productData.image_url;

    const serving = productData["serving_quantity"];

    if (serving) {
        servingElem.innerText = serving;
        servingUnitElem.innerText = productData["serving_quantity_unit"];
        energyElem.innerText = (nutriments["energy-kcal_serving"] || nutriments["energy-kj_serving"] / 4.2) + "kcal";
    }

    energy100Elem.innerText = nutriments["energy-kcal_100g"] + "kcal"

    if (!nutriments["energy-kcal_100g"]) {
        energy100Elem.innerText = (nutriments["energy-kcal"] || nutriments["energy-kj"] / 4.2) / productData.quantity * 100 + "kcal";
    }

    const totalProteins = parseFloat(nutriments["proteins"]) * (consumedQuantity / 100);
    const totalCarbohydrates = parseFloat(nutriments["carbohydrates"]) * (consumedQuantity / 100);
    const totalFat = parseFloat(nutriments["fat"] || nutriments["saturated-fat"]) * (consumedQuantity / 100);
    const totalMacros = totalProteins + totalCarbohydrates + totalFat;
   
    const proteins = totalProteins.toFixed(1) + nutriments["proteins_unit"];
    proteinasElem.innerText = proteins;
    productToSave.proteins = proteins;

    const carbos = totalCarbohydrates.toFixed(1) + nutriments["carbohydrates_unit"];
    carboElem.innerText = carbos
    productToSave.carbo = carbos

    const fat = totalFat.toFixed(1) + (nutriments["fat_unit"] || nutriments["saturated-fat_unit"]);
    lipElem.innerText = fat;
    productToSave.fat = fat;

    const SIZE_SCALAR = 1 * 100;

    const proteinPercentage = (totalProteins / totalMacros) * SIZE_SCALAR;
    const carbPercentage = (totalCarbohydrates / totalMacros) * SIZE_SCALAR;
    const fatPercentage = (totalFat / totalMacros) * SIZE_SCALAR;

    proteinMacroElem.style.width = `calc(40% + ${proteinPercentage}%)`;
    carboMacroElem.style.width = `calc(40% + ${carbPercentage}%)`;
    lipMacroElem.style.width = `calc(40% + ${fatPercentage}%)`;

    // Calculate total consumed calories and update the value and unit separately
    const totalConsumedCalories = (nutriments["energy-kcal_100g"] || nutriments["energy-kj"] / 4.2) * (consumedQuantity / 100);
    totalConsumedKcalElem.innerText = formatValue(totalConsumedCalories);

    productToSave.energy = totalConsumedCalories;
    productToSave.title = productData.product_name;
    productToSave.image = productData.image_url;
};

const loadProduct = async () => {
    const codFromParams = urlParams.get("cod");
    if (codFromParams == null) return location.href = "/";
    if (codFromParams) {
        const product = await fetchProductData(codFromParams);
        productData = {
            product_name: product.product.product_name,
            image_url: product.product.image_url,
            quantity: product.product.product_quantity,
            nutriments: product.product.nutriments,
            serving_quantity: product.product.serving_quantity,
            serving_quantity_unit: product.product.serving_quantity_unit
        };

        updateProductDetails();
    }
};

const saveProductButton = document.querySelector("#register-info-btn");

const saveProduct = (product) => {
    const SAVED_PRODUCTS_LOCAL_NAME = "nutrihub-saved";
    let savedProducts = localStorage.getItem(SAVED_PRODUCTS_LOCAL_NAME);

    savedProducts = JSON.parse(savedProducts) || [];
    savedProducts.push(product);

    const toSave = JSON.stringify(savedProducts);
    localStorage.setItem(SAVED_PRODUCTS_LOCAL_NAME, toSave);
    location.href = "/diary.html";
};

saveProductButton.addEventListener("click", () => saveProduct(productToSave));

consumedQuantityInput.addEventListener("blur", (e) => {
    const consumedQuantityText = e.target.textContent.trim();
    const consumedQuantity = parseFloat(consumedQuantityText);
    if (!isNaN(consumedQuantity)) {
        updateProductDetails(consumedQuantity);
    }
});

window.onload = loadProduct;
