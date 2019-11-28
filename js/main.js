//create global variables
var storeItems = []; //empty array to have the store items
var cartItems = []; //empty array to have the cart items
var cart = new Cart(); //create a new Cart for the User
var store = new Store(); //create a new Store for the app
var currencyInformation = {
    "currencySymbol":"CAD",
    "currencyName":"Canadian Dollar",
    "currencyRate":1,
    "currencyTaxRate":0.13
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

//detect change of page
window.onbeforeunload = function(event){
    console.log('event=',event);
    return "a";
}

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
var timer = window.setInterval(updateTime,1000*60);

//the storage variable is a global defined by the inclusion of the file before main.js on index.html

const initialize = function(){
    //call testing for main functionalities
    generalTest();

    //populate categories filter
    populateCatalogFilter();
    populateCurrencyDropBox();
    //TODO: The displayStore rewrite everything on the list, erasing the binds. remake all catalog binds as a function to execute inside displayStoreItems
    displayStoreItems();

    //bind events
    document.getElementById("hamburguer").addEventListener("click",toggleMenu);
    document.getElementById("closeMenu").addEventListener("click",closeMenu);

    //bind additions and subtractions to catalog items
    bindElementsOnCatalog();
    initialized = true;
}

const generalTest = function(){
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

function updateTime (){
    //executes only if the page is already initialized
    if(!initialized) return false;
    date = new Date();
    currentTime = new Intl.DateTimeFormat('en-US',options).format(date);
    currentTimeElements = document.querySelectorAll("div.currentTime");
    Array.from(currentTimeElements).forEach((element)=>element.innerHTML = "Good morning! Today is " + currentTime);
}//end of function updateTime

function addInitialItemsToStore (){
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

const generateItemCardMarkup = function(item){
    var card = document.createElement("div");
    card.setAttribute("class","storeItem");
    card.setAttribute("id",item.id);
}

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

const populateCurrencyDropBox = function(){
    var currencySelectionElement = document.getElementById("currencySelection");
    console.log("currencySelectionElement",currencySelectionElement);
    var currencyOption;
    currenciesList.forEach((item,index)=>{
        console.log("populateCurrencyDropBox item iterated = ",item);
        currencyOption = document.createElement("option");
        console.log("currencyOption element=",currencyOption);
        currencyOption.value = index;
        console.log("option innerHTML being inserted=",item.currencyName);
        currencyOption.innerHTML = item.currencySymbol + "$";
        console.log("option = ",currencyOption);
        currencySelectionElement.appendChild(currencyOption);
    });
}

const changeCurrency = function(){
    console.log("currencies into changeCurrency=",currenciesList);
    let currencySelectionElement = document.getElementById("currencySelection");
    let currencyOption = currencySelectionElement.value;
    currencyInformation.currencySymbol = currenciesList[+currencyOption].currencySymbol;
    currencyInformation.currencyName = currenciesList[+currencyOption].currencyName;
    currencyInformation.currencyRate = parseFloat(+currenciesList[+currencyOption].currencyRate);
    currencyInformation.currencyTaxRate = parseFloat(+currenciesList[+currencyOption].currencyTaxRate);
    console.log("currencyInformation = ",currencyInformation);
    //change only the prices information so that the page does not have to be reloaded
    let currencySymbolElements = document.querySelectorAll(".currencySymbol");
    let currencyPriceElements = document.querySelectorAll(".currencyPrice");
    currencySymbolElements.forEach((element)=>{
        element.textContent = currencyInformation.currencySymbol + "$ ";
    });
    currencyPriceElements.forEach((element)=>{
        element.textContent = (parseFloat(+currencyInformation.currencyRate) * parseFloat(+element.getAttribute("price"))).toFixed(2);
    });
}

const sortCatalogItems = function(){
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

const clearAllFilters = function(){
    //assign variable to category selection
    var catalogCategorySelectionElement = document.getElementById("catalogCategorySelection");
    catalogCategorySelectionElement.selectedIndex = 0;
    var catalogSort = document.getElementById("catalogSort");
    catalogSort.selectedIndex = 0;
    store.items.sortIdAscendant();
    displayStoreItems();
}


const displayStoreItems = function(){
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
        priceColumn.setAttribute("itemId",item.id);
        priceColumn.setAttribute("priceValue",item.price);
        
        //attach spam with currency symbol
        let currencySymbolElement = document.createElement("span");
        currencySymbolElement.className = "currencySymbol";
        currencySymbolElement.setAttribute("itemId",item.id);
        let currencySymbol = document.createTextNode(currencyInformation.currencySymbol + "$ ");
        currencySymbolElement.appendChild(currencySymbol);
        
        //attach spam with price symbol
        let currencyPriceElement = document.createElement("span");
        currencyPriceElement.className = "currencyPrice";
        currencyPriceElement.setAttribute("itemId",item.id);
        currencyPriceElement.setAttribute("price",item.price);
        let currencyPrice = document.createTextNode((item.price * parseFloat(+currencyInformation.currencyRate)).toFixed(2));
        currencyPriceElement.appendChild(currencyPrice);

        priceColumn.appendChild(currencySymbolElement);
        priceColumn.appendChild(currencyPriceElement);

        row.appendChild(priceColumn);

        let qtyOnHandColumn = document.createElement("div");
        qtyOnHandColumn.className = "storeItemColumn storeItemQtyOnHandColumn";
        qtyOnHandColumn.setAttribute("itemId",item.id);
        qtyOnHandColumn.innerHTML = item.qtyOnHand + " in stock";
        row.appendChild(qtyOnHandColumn);

        let maxPerCustomerColumn = document.createElement("div");
        maxPerCustomerColumn.className = "storeItemColumn storeItemMaxPerCustomerColumn";
        maxPerCustomerColumn.setAttribute("itemId",item.id);
        maxPerCustomerColumn.innerHTML = "max " + item.maxPerCustomer + " items per customer";
        row.appendChild(maxPerCustomerColumn);

        let addToCartContainerColumn = document.createElement("div");
        addToCartContainerColumn.className = "storeItemColumn storeItemAddToCartContainerColumn";
        row.appendChild(addToCartContainerColumn);

        let addToCartColumn = document.createElement("div");
        addToCartColumn.className = "storeItemColumn storeItemAddToCartColumn";
        addToCartColumn.innerHTML = "add to cart";
        addToCartColumn.setAttribute("itemId",item.id);
        addToCartColumn.setAttribute("qtyToCart",0);
        row.appendChild(addToCartColumn);

        let addAmountToCartColumn = document.createElement("div");
        addAmountToCartColumn.className = "storeItemColumn storeItemAddAmountToCartColumn";
        addAmountToCartColumn.setAttribute("itemId",item.id);
        addAmountToCartColumn.innerHTML = `<li itemId='${item.id}' class='material-icons'>add</i>`;;
        addToCartContainerColumn.appendChild(addAmountToCartColumn);

        let subtractAmountFromCartColumn = document.createElement("div");
        subtractAmountFromCartColumn.className = "storeItemColumn storeItemSubtractAmountFromCartColumn";
        subtractAmountFromCartColumn.setAttribute("itemId",item.id);
        subtractAmountFromCartColumn.innerHTML = `<li itemId='${item.id}' class='material-icons'>remove</i>`;
        addToCartContainerColumn.appendChild(subtractAmountFromCartColumn);

        let amountToCartColumn = document.createElement("div");
        amountToCartColumn.className = "storeItemColumn storeItemAmountToCartColumn";
        amountToCartColumn.setAttribute("itemId",item.id);
        amountToCartColumn.innerHTML = "qtd:<span class='qtyNumber'>0</span>";
        addToCartContainerColumn.appendChild(amountToCartColumn);
        
        storeItemsContentElement.appendChild(row);
    });//end of iteration through store item
    document.getElementById("catalogList").appendChild(storeItemsContentElement);

    bindElementsOnCatalog();

    return storeItemsContentElement;
}

const toggleMenu = function(){
    let menu = document.querySelector("container nav ul");
    let catalogShadow = document.getElementById("catalogShadow");
    if(menu.style.display=="none") {
        menu.style.display="block";
        catalogShadow.style.display="block";

    } else {
        menu.style.display="none";
        catalogShadow.style.display="none";
    }
}

const closeMenu = function(){
    let menu = document.querySelector("container nav ul");
    let catalogShadow = document.getElementById("catalogShadow");
    menu.style.display="none";
    catalogShadow.style.display="none";
}

//actions to cart
const addAmountToGoToCart = function(){
    //"this" is the element clicked
    //retrieve the itemId from the product from this element
    let itemId = this.getAttribute("itemId");
    console.log("itemId=",itemId);
    console.log("store items find per Id = ", store.items.findPerId(itemId));
    let maxQtyPerCustomer = store.items.findPerId(itemId).maxPerCustomer;
    let qtyOnHand = store.items.findPerId(itemId).qtyOnHand;
    //get element of the quantity number
    let qtyElement = document.querySelector(`.storeItemAmountToCartColumn[itemId='${itemId}'] .qtyNumber`);
    let qty = parseInt(+qtyElement.innerHTML.replace(/\s+/gi,""));
    console.log(`qty for item ${itemId}=`,qty);
    ( qty < maxQtyPerCustomer && qty < qtyOnHand ) ? qty++ : qty;

    //update quantity at the page, in the respective element
    qtyElement.innerHTML = qty;

    //update attribute qty on button 'addToCart'
    document.querySelector(`.storeItemAddToCartColumn[itemId='${itemId}']`).setAttribute('qtyToCart',qty);

    if( qty == maxQtyPerCustomer ){
        let maxPerCustomerElement = document.querySelector(`.storeItemMaxPerCustomerColumn[itemId='${itemId}']`);
        let classNames = maxPerCustomerElement.className.split(" ");
        if(classNames.indexOf("overlimit")==-1){
            classNames.push("overlimit");
            maxPerCustomerElement.className = classNames.join(" ");
        }    
    }

    if( qty == qtyOnHand ){
        let qtyOnHandElement = document.querySelector(`.storeItemQtyOnHandColumn[itemId='${itemId}']`);
        let classNames = qtyOnHandElement.className.split(" ");
        if(classNames.indexOf("overlimit")==-1){
            classNames.push("overlimit");
            qtyOnHandElement.className = classNames.join(" ");
        }    
    }

}
const subtractAmountToGoToCart = function(){
    //"this" is the element clicked
    //retrieve the itemId from the product from this element
    let itemId = this.getAttribute("itemId");
    console.log("itemId=",itemId);
    let maxQtyPerCustomer = store.items.findPerId(itemId).maxPerCustomer;
    let qtyOnHand = store.items.findPerId(itemId).qtyOnHand;
    //get element of the quantity number
    let qtyElement = document.querySelector(`.storeItemAmountToCartColumn[itemId='${itemId}'] .qtyNumber`);
    let qty = parseInt(+qtyElement.innerHTML.replace(/\s+/gi,""));
    console.log(`subtract qty for item ${itemId}=`,qty);
    (qty == 0) ? qty : qty--;

    //update quantity at the page, in the respective element
    qtyElement.innerHTML = qty;

    //update attribute qty on button 'addToCart'
    document.querySelector(`.storeItemAddToCartColumn[itemId='${itemId}']`).setAttribute('qtyToCart',qty);

    if( qty == maxQtyPerCustomer - 1 ){
        let maxPerCustomerElement = document.querySelector(`.storeItemMaxPerCustomerColumn[itemId='${itemId}']`);
        let classNames = maxPerCustomerElement.className.split(" ");
        console.log("classNames=",classNames)
        let index = classNames.indexOf("overlimit");
        if(index!==-1){
            classNames.splice(index,1);
            maxPerCustomerElement.className = classNames.join(" ");
        }
        
    }

    if( qty == qtyOnHand - 1 ){
        let qtyOnHandElement = document.querySelector(`.storeItemQtyOnHandColumn[itemId='${itemId}']`);
        let classNames = qtyOnHandElement.className.split(" ");
        let index = classNames.indexOf("overlimit");
        if(index!==-1){
            classNames.splice(index,1);
            qtyOnHandElement.className = classNames.join(" ");
        }
    }

}

const bindElementsOnCatalog = function (){
    document.querySelectorAll(".storeItemAddAmountToCartColumn").forEach((element)=>element.addEventListener("click",addAmountToGoToCart,false));
    document.querySelectorAll(".storeItemSubtractAmountFromCartColumn").forEach((element)=>element.addEventListener("click",subtractAmountToGoToCart,false));
    
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

Array.prototype.findPerId = function(itemId){
    return this.find((element)=>element.id==itemId);
}