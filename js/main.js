//create global variables
var storeItems = []; //empty array to have the store items
var cartItems = []; //empty array to have the cart items
var cart = new Cart(); //create a new Cart for the User
var store = new Store(); //create a new Store for the app
var currencyInformation = {
    "currencySymbol":"CAD",
    "currencyName":"Canadian Dollar",
    "currencyRate":1
}

//constants
const URL_ORIGIN = window.location.origin;
const URL_PATHNAME = window.location.pathname;
const URL_HOSTNAME = window.location.hostname;
const URL_HOST = window.location.host;
const URL_PUBLIC = URL_ORIGIN + URL_PATHNAME.substring(0,URL_PATHNAME.lastIndexOf("/")) + "/public";

console.log("URL_ORIGIN = ", URL_ORIGIN);
console.log("URL_PATHNAME = ", URL_PATHNAME);
console.log("URL_HOST = ", URL_HOST);
console.log("URL_HOSTNAME = ", URL_HOSTNAME);

//call function to add initial items to store
if(!(addInitialItemsToStore().success)) alert ("Problems on load initial storage items!");
console.log("store=",store);

//state variables
var initialized = false;

//initialize the current time and a timeout to update it each second
var date = new Date();
var options = {weekday:'short',year:'numeric',month:'short', day:'numeric', hour: 'numeric', minute: 'numeric'};
var currentTime = new Intl.DateTimeFormat('en-US',options).format(date); //variable that will store the current date and time;
var currentTimeElements;
var timer = window.setInterval(updateTime,1000);

//the storage variable is a global defined by the inclusion of the file before main.js on index.html

function initialize(){
    //call testing for main functionalities
    generalTest();

    //populate categories filter
    populateCatalogFilter();
    populateCurrencyDropBox();
    displayStoreItems();
    initialized = true;
}

function generalTest(){
    //test the instantiation of the object Store Item
    try{
        var storeItem = new StoreItem();
        console.log("storeItem instance=>",storeItem);
    } catch(e){
        console.log("Exception on creation of StoreItem! Follow statement",e);
    }
    delete storeItem;

     //test the instantiation of the object Cart Item
     try{
         var cartItem = new CartItem();
         console.log("cartItem instance=>",cartItem);
     } catch(e){
         console.log("Exception on creation of CartItem! Follow statement",e);
     }
     delete cartItem;

     //test the existance of current time
     console.log("current time:", currentTime);
}

function updateTime(){
    //executes only if the page is already initialized
    if(!initialized) return false;
    date = new Date();
    currentTime = new Intl.DateTimeFormat('en-US',options).format(date);
    currentTimeElements = document.querySelectorAll("div.currentTime");
    Array.from(currentTimeElements).forEach((element)=>element.innerHTML = "Good morning! Today is " + currentTime);
}//end of function updateTime

function addInitialItemsToStore(){
    //the initialStorage variable is a global defined by the inclusion of the file before main.js on index.html
    try{
        //use method on class Storage to add a item
        //picking items from "initialStorage"
        initialStorage.forEach((item)=>store.addItem(item));
    } catch(error){
        return {success:false,errorMessage:error.message};
    }
    return{success:true,message:"items added with success"};

}

function generateItemCardMarkup(item){
    var card = document.createElement("div");
    card.setAttribute("class","storeItem");
    card.setAttribute("id",item.id);
    
}

function populateCatalogFilter(){
    //assign variable to catalog filter selection
    var selectionElement = document.getElementById("catalogCategorySelection");
    //initialize categories array
    var categories = [];
    store.items.forEach((item)=>{
        categories.indexOf(item.category)===-1?categories.push(item.category):null
    });
    //sort category items in ascendent alphabetical
    categories.sortAscendant();
    console.log("categories array filled out:",categories);

    //iterate through each item of categories
    //each iteration creates an option element
    //and assign proper values and attributes
    //according to the category item
    var category;
    categories.forEach((item)=>{
        console.log("category in the loop=",item);
        category = document.createElement("option");
        category.value = item.replace(/\s+/gi,"").toLowerCase();
        category.innerHTML = item;
        selectionElement.appendChild(category);
        return;
    });//end of categories foreach
}

function populateCurrencyDropBox(){
    var currencySelectionElement = document.getElementById("currencySelection");
    console.log("currencySelectionElement",currencySelectionElement);
    var currencyOption;
    currenciesList.forEach((item,index)=>{
        console.log("populateCurrencyDropBox item iterated = ",item);
        currencyOption = document.createElement("option");
        console.log("currencyOption element=",currencyOption);
        currencyOption.value = index;
        console.log("option innerHTML being inserted=",item.currencyName);
        currencyOption.innerHTML = item.currencyName;
        console.log("option = ",currencyOption);
        currencySelectionElement.appendChild(currencyOption);
    });
}

function changeCurrency(){
    console.log("currencies into changeCurrency=",currenciesList);
    var currencySelectionElement = document.getElementById("currencySelection");
    var currencyOption = currencySelectionElement.value;
    currencyInformation.currencySymbol = currenciesList[+currencyOption].currencySymbol;
    currencyInformation.currencyName = currenciesList[+currencyOption].currencyName;
    currencyInformation.currencyRate = parseFloat(+currenciesList[+currencyOption].currencyRate);
    console.log("currencyInformation = ",currencyInformation);
    displayStoreItems();
}

function sortCatalogItems(){
    //assign variable to sort selection
    var sortSelectionElement = document.getElementById("catalogSort");
    //verify which type of sort was chosen
    var sortType = sortSelectionElement.value;
    switch(sortType){
        case "":
            store.items.sortIdAscendant();
        break;
        case "alphabeticallyAscendant":
            store.items.sortNameAscendant();
        break;
        case "alphabeticallyDescendant":
            store.items.sortNameDescendant();
        break;
        case "priceLowToHigh":
            store.items.sortPriceLowToHigh();
        break;
        case "priceHighToLow":
            store.items.sortPriceHighToLow();
        break;
        case "evaluationHighToLow":

        break;
    }
    displayStoreItems();
}

function clearAllFilters(){
    //assign variable to category selection
    var catalogCategorySelectionElement = document.getElementById("catalogCategorySelection");
    catalogCategorySelectionElement.selectedIndex = 0;
    var catalogSort = document.getElementById("catalogSort");
    catalogSort.selectedIndex = 0;
    store.items.sortIdAscendant();
    displayStoreItems();
}


function displayStoreItems(){
    //collect category filter element to variable
    var categoryFilter = document.getElementById("catalogCategorySelection");
    var categorySelected = categoryFilter.value;
    console.log("category selected = ", categorySelected);

    //assign filtered items according to category selected to a variable
    //this variable will be used as the array that will serve as
    //source to populate container
    var filteredStoreItems = categorySelected=="all" ? filteredStoreItems = store.items.slice(0) : store.items.filter((item)=>item.category.replace(/\s+/gi,"").toLowerCase()===categorySelected);
    console.log("filtered store items",filteredStoreItems);

    //empty catalog list
    document.getElementById("catalogList").innerHTML = "";

    //create html element to contain store elements
    var storeItemsContentElement = document.createElement("div");
    storeItemsContentElement.id = "storeItemsContainer";
    console.log("store = ",store);

    //iterate through store items
    filteredStoreItems.forEach((item)=>{
        console.log("item=>",item);
        let row = document.createElement("div");
        row.className = "storeItemsRow";
        
        let idColumn = document.createElement("div");
        idColumn.className = "storeItemColumn storeItemIdColumn";
        idColumn.innerHTML = "Code: " + item.id;
        row.appendChild(idColumn);

        let nameColumn = document.createElement("div");
        nameColumn.className = "storeItemColumn storeItemNameColumn";
        nameColumn.innerHTML = item.name.substr(0,50) + (item.name.length>50 ? "..." : "");
        row.appendChild(nameColumn);

        let imageColumn = document.createElement("div");
        imageColumn.className = "storeItemColumn storeItemImageColumn";
        let imageElement = document.createElement("img");
        imageElement.src = URL_PUBLIC + "/images/"+item.image;
        imageElement.alt = "image of " + item.name;
        imageColumn.appendChild(imageElement);
        row.appendChild(imageColumn);

        let priceColumn = document.createElement("div");
        priceColumn.className = "storeItemColumn storeItemPriceColumn";
        priceColumn.innerHTML = currencyInformation.currencySymbol + "$ " + (item.price * parseFloat(+currencyInformation.currencyRate)).toFixed(2);
        row.appendChild(priceColumn);

        let qtyOnHandColumn = document.createElement("div");
        qtyOnHandColumn.className = "storeItemColumn storeItemQtyOnHandColumn";
        qtyOnHandColumn.innerHTML = item.qtyOnHand + " in stock";
        row.appendChild(qtyOnHandColumn);

        let maxPerCustomerColumn = document.createElement("div");
        maxPerCustomerColumn.className = "storeItemColumn storeItemMaxPerCustomerColumn";
        maxPerCustomerColumn.innerHTML = "max " + item.maxPerCustomer + " items per customer";
        row.appendChild(maxPerCustomerColumn);

        storeItemsContentElement.appendChild(row);
    });//end of iteration through store item
    document.getElementById("catalogList").appendChild(storeItemsContentElement);

    return storeItemsContentElement;
}

//Sorts contents of an array ascendantly
//based on example given at 
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
Array.prototype.sortAscendant = function (){
    this.sort((a,b)=>{
        category1 = a.toLowerCase();//to lower case make the coparison to be case insensitive
        category2 = b.toLowerCase();//to lower case make the coparison to be case insensitive
        if(category1 < category2) return -1;
        if(category1 > category2) return 1;
        return 0;
    })
    return this;
}

//Sorts contents of an array descendantly
//based on example given at 
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
Array.prototype.sortDescendant = function (){
    this.sort((a,b)=>{
        category1 = a.toLowerCase();//to lower case make the coparison to be case insensitive
        category2 = b.toLowerCase();//to lower case make the coparison to be case insensitive
        if(category1 < category2) return 1;
        if(category1 > category2) return -1;
        return 0;
    })
    return this;
}

Array.prototype.sortPriceLowToHigh = function (){
    this.sort((a,b)=>{
        console.log("product a=",a);
        price1 = a.price;//to lower case make the coparison to be case insensitive
        price2 = b.price;//to lower case make the coparison to be case insensitive
        if(price1 < price2) return -1;
        if(price1 > price2) return 1;
        return 0;
    })
    return this;
}

Array.prototype.sortPriceHighToLow = function (){
    this.sort((a,b)=>{
        price1 = a.price;//to lower case make the coparison to be case insensitive
        price2 = b.price;//to lower case make the coparison to be case insensitive
        if(price1 < price2) return 1;
        if(price1 > price2) return -1;
        return 0;
    })
    return this;
}

Array.prototype.sortNameAscendant = function (){
    this.sort((a,b)=>{
        category1 = a.name.toLowerCase();//to lower case make the coparison to be case insensitive
        category2 = b.name.toLowerCase();//to lower case make the coparison to be case insensitive
        if(category1 < category2) return -1;
        if(category1 > category2) return 1;
        return 0;
    })
    return this;
}

Array.prototype.sortNameDescendant = function (){
    this.sort((a,b)=>{
        category1 = a.name.toLowerCase();//to lower case make the coparison to be case insensitive
        category2 = b.name.toLowerCase();//to lower case make the coparison to be case insensitive
        if(category1 < category2) return 1;
        if(category1 > category2) return -1;
        return 0;
    })
    return this;
}

Array.prototype.sortIdAscendant = function (){
    this.sort((a,b)=>{
        category1 = a.id.toLowerCase();//to lower case make the coparison to be case insensitive
        category2 = b.id.toLowerCase();//to lower case make the coparison to be case insensitive
        if(category1 < category2) return -1;
        if(category1 > category2) return 1;
        return 0;
    })
    return this;
}

Array.prototype.sortIdDescendant = function (){
    this.sort((a,b)=>{
        category1 = a.id.toLowerCase();//to lower case make the coparison to be case insensitive
        category2 = b.id.toLowerCase();//to lower case make the coparison to be case insensitive
        if(category1 < category2) return 1;
        if(category1 > category2) return -1;
        return 0;
    })
    return this;
}