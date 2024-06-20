const SAVED_PRODUCTS_LOCAL_NAME = "nutrihub-saved";

const itemsStored = JSON.parse(localStorage.getItem(SAVED_PRODUCTS_LOCAL_NAME));
const diaryList = document.querySelector("#diary-list");

const diaryItemComponent = (item) => {
    return (`
        <div class="diary-img-container">
            <img src="${item.image}" alt="" class="diary-img">
        </div>
        <div class="diary-details-container">
            <h1 class="diary-product-title">${item.title}</h1>
            <div class="diary-product-macros">
                <span class="diary-product-macro">
                    <span class="diary-product-macro-title">Carbo.:</span>
                    <span class="diary-product-macro-value">${item.carbo}</span>
                </span>
                <span class="diary-product-macro">
                    <span class="diary-product-macro-title">Prot.:</span>
                    <span class="diary-product-macro-value">${item.proteins}</span>
                </span>
                <span class="diary-product-macro">
                    <span class="diary-product-macro-title">Lip.:</span>
                    <span class="diary-product-macro-value">${item.fat}</span>
                </span>
            </div>
        </div>
        <h2 class="diary-total-kcal">${formatValue(item.energy)}kcal</h2>
    `)
}



const clearAllDeletes = () => {
    document.querySelectorAll(".diary-item").forEach((item) => {
        item.classList.remove("delete");
    })
}


const deleteByIndex = (i) => {
    itemsStored.splice(i-1, 1);
    updateList();
}

const formatValue = value => (value % 1 === 0 ? parseInt(value) : value.toFixed(1));

const updateList = () => {
    let totalKcalSum = 0;
    diaryList.innerHTML = "";
    
    localStorage.setItem(SAVED_PRODUCTS_LOCAL_NAME, JSON.stringify(itemsStored));

    for ([i, item] of Object.entries(itemsStored)) {
        const itemElem = document.createElement("div");
        itemElem.classList.add("diary-item");
        itemElem.innerHTML = diaryItemComponent(item);
    
    
        let longPressTimer;
    
        const startLongPress = () => {
            if(itemElem.classList.contains("delete")){
                deleteByIndex(i);
            }
    
            longPressTimer = setTimeout(() => {
                clearAllDeletes();
                itemElem.classList.add('delete');
            }, 500); 
        };
        itemElem.addEventListener('touchstart', (e) => {
            e.preventDefault(); 
            startLongPress();
        });
        itemElem.addEventListener('mousedown', () => {
            startLongPress();
        });
    
        const endLongPress = () => {
            clearTimeout(longPressTimer); 
        };
        itemElem.addEventListener('touchend', () => {
            endLongPress();
        });
        itemElem.addEventListener('mouseup', () => {
            endLongPress();
        });
    
        diaryList.appendChild(itemElem);
        totalKcalSum += item.energy;
    }

    const totalKcalElem = document.querySelector("#total-kcal");
    totalKcalElem.innerText = formatValue(totalKcalSum) + "kcal"
}

document.body.onclick = () => {
    clearAllDeletes();
}



const backButton = document.querySelector("#back-button");
backButton.onclick = () => { history.back() }

updateList()