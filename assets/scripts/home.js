const checkInfoBtn = document.querySelector("#check-info-btn");


checkInfoBtn.addEventListener("click", () => {
    goToInfoPage();    
})

const goToInfoPage = (code) => {
    if(!code) code = document.querySelector("#input-scan").value

    location.href=`/lookup.html?cod=${code}`; 
}