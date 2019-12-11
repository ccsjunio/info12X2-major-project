const populateCatalogFilter = function(){
    //assign variable to catalog filter selection
    var selectionElement = document.getElementById("catalogCategorySelection");
    //initialize categories array
    var categories = [];
    store.items.forEach((item)=>{
        categories.indexOf(item.category)===-1?categories.push(item.category):null
    });
    //sort category items in ascendent alphabetical
    categories.sortAscendant();
    //console.log("categories array filled out:",categories);

    //iterate through each item of categories
    //each iteration creates an option element
    //and assign proper values and attributes
    //according to the category item
    var category;
    categories.forEach((item)=>{
        //console.log("category in the loop=",item);
        category = document.createElement("option");
        category.value = item.replace(/\s+/gi,"").toLowerCase();
        category.innerHTML = item;
        selectionElement.appendChild(category);
        return;
    });//end of categories foreach
}

const populateCurrencyDropBox = function(){
    
    let currencySelectionElement = document.getElementById("currencySelection");
    console.log("currencySelectionElement",currencySelectionElement);
    let currencyOption;
    let currencyOptionOnMainMenu = document.querySelector(`nav#mainMenu > ul > li > ul.goToCurrency`);
    currenciesList.forEach((item,index)=>{
        //populate currency dropbox at catalog screen
        //console.log("populateCurrencyDropBox item iterated = ",item);
        currencyOption = document.createElement("option");
        //console.log("currencyOption element=",currencyOption);
        currencyOption.value = index;
        //console.log("option innerHTML being inserted=",item.currencyName);
        currencyOption.innerHTML = item.currencySymbol + "$";
        //console.log("option = ",currencyOption);
        currencySelectionElement.appendChild(currencyOption);
        
        //populate main menu
        let currencyItemOnCurrencyMenu = document.createElement("li");
        currencyOptionOnMainMenu.appendChild(currencyItemOnCurrencyMenu);
        currencyItemOnCurrencyMenu.textContent = item.currencySymbol + "$";
        currencyItemOnCurrencyMenu.setAttribute("index",index);
    });
    
}