//TODO: Fix check of max qty of items per customer when adding from catalog
//Now it is not considering how many items are in the cart already

//create global variables for data
let storeItems = []; //empty array to have the store items
let cartItems = []; //empty array to have the cart items
let cart = new Cart(); //create a new Cart for the User
let store = new Store(); //create a new Store for the app
let currencyInformation = {
    "currencySymbol":"CAD",
    "currencyName":"Canadian Dollar",
    "currencyRate":1,
    "currencyTaxRate":0.13
}

//create global variables for render purposes 
//(these depend on finalizing render of page)
let greyArea;
let menu;
let catalogSection;
let cartSection;
let currencySection;
let checkoutSection;
let detailsSection;
let sourcesSection;

let cartMenu;
let mainMenu;

let catalogList;

//constants for organization of file location relative reference
const URL_ORIGIN = window.location.origin;
const URL_PATHNAME = window.location.pathname;
const URL_HOSTNAME = window.location.hostname;
const URL_HOST = window.location.host;
const URL_PUBLIC = URL_ORIGIN + URL_PATHNAME.substring(0,URL_PATHNAME.lastIndexOf("/")) + "/public";

//detect the tentative change of page by user
//TODO: to deal with this
window.onbeforeunload = function(event){
    console.log('event=',event);
    return "a";
}

//call function to add initial items to store
//through a method from instance of store
//TODO: change to call these items from database
if(!(store.addItems(initialStorage).success)) alert ("Problems on load initial storage items!");
console.log("store=",store);

//state variables
let initialized = false; //this means that the page was not initialized yet

//initialize the current time and a timeout to update it each second
let date = new Date();
let options = {weekday:'short',year:'numeric',month:'short', day:'numeric', hour: 'numeric', minute: 'numeric'};//show time only up to minutes
let currentTime = new Intl.DateTimeFormat('en-US',options).format(date); //variable that will store the current date and time;
let currentTimeElements;
let timer = window.setInterval(updateTime,1000); //update time each second=1000ms

//the storage variable is a global defined by the inclusion of the file before main.js on index.html

/* **********************************************************************************
Function: initialize
Description: initialize parameters and variables for the system
Author: Carlos Cesar Ferraz
Last Update: Dec 7, 2019
************************************************************************************ */
const initialize = () => {
    //call testing for main functionalities
    //TODO: improve this tests funcionalities
    console.log("beggining initialization...............");
    generalTest();
    //populate categories filter
    populateCatalogFilter();
    populateCurrencyDropBox();
     //section elements on the page
    //assign section catalog to a instance of DisplayElement
    catalogSection = new DisplayElement("catalogSection",{category:"section",exclusive:true});
    //assign section cart to a instance of DisplayElement
    cartSection = new DisplayElement("cartSection",{category:"section",exclusive:true});
    //assign section currency to a instance of DisplayElement
    currencySection = new DisplayElement("currencySection",{category:"section",exclusive:true});
    //assign section checkout to a instance of DisplayElement
    checkoutSection = new DisplayElement("checkoutSection",{category:"section",exclusive:true});
    //assign details section to a instance of DisplayElement
    detailsSection = new DisplayElement("detailsSection",{category:"section",exclusive:true});
    //assign resource section to a instance of DisplayElement
    checkoutResources = new DisplayElement("resourcesSection",{category:"section",exclusive:true});

    //assign menus to a instance of DisplayElement
    cartMenu = new DisplayElement("cartMenu",{category:"nav.menu",exclusive:true,"greyArea":true});
    mainMenu = new DisplayElement("mainMenu",{category:"nav.menu",exclusive:true,"greyArea":true});

    //assign catalog list to a variable
    catalogList = new CatalogList("catalogList");

    //assign variable to greyArea
    greyArea = new GreyArea();

    //TODO: The displayStore rewrite everything on the list, erasing the binds. remake all catalog binds as a function to execute inside displayStoreItems
    displayStoreItems();
   
    //bind additions and subtractions to catalog items
    //bindElementsOnCatalog();

    //show catalog section
    catalogSection.show();

    //indicate that the page was initialized
    initialized = true;
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
    //update cart menu
    updateCart();
}

//toggling elements

const switchToCart = function(){

    //control visibilities
    cartSection.show();
    wrapUpSwitch();

}//end of switchToCart

const switchToCatalog = function(){
    
    //control visibilities
   catalogSection.show()
    wrapUpSwitch();

}//end of switchToCatalog

const switchToCurrency = function(){
    
    //control visibilities
    currencySection.show()
    wrapUpSwitch();

}//end of switchToCurrency

const switchToCheckout = function(){
    
    //control visibilities
    checkoutSection.show();
    wrapUpSwitch();

}//end of switchToCurrency

const wrapUpSwitch = function(){
    turnOffGreyArea();
    cartMenu.hide();
    mainMenu.hide();
}//end of wrapUpSwitch

const askForConfirmation = function(question,callbackYes,callbackNo){
    
    console.log("reached askForConfirmation");

    turnOnGreyArea();
    
    const modal = document.createElement("div");
    modal.className = "modal";

    const alertImage = document.createElement("div");
    alertImage.className = "alertImage";
    modal.appendChild(alertImage);

    const imageElement = document.createElement("img");
    imageElement.className = "image";
    imageElement.src = URL_PUBLIC + "/images/" + "warning-1.gif";
    imageElement.alt = "warning image";
    imageElement.setAttribute("source","https://icons8.com/animated-icons/warning-1");
    alertImage.appendChild(imageElement);

    const modalText = document.createElement("div");
    modalText.className = "modalText";
    modalText.textContent = question;
    modal.appendChild(modalText);

    const actionButtons = document.createElement("div");
    actionButtons.className = "actionButtons";
    modal.appendChild(actionButtons);

    const actionButtonYes = document.createElement("div");
    actionButtonYes.className = "actionButtonYes";
    actionButtonYes.textContent = "yes";
    actionButtons.appendChild(actionButtonYes);

    const actionButtonNo = document.createElement("div");
    actionButtonNo.className = "actionButtonNo";
    actionButtonNo.textContent = "no";
    actionButtons.appendChild(actionButtonNo);

    document.body.appendChild(modal);

    console.log("callback to yes:",callbackYes);
    console.log("callback to no:",callbackNo);

    document.querySelectorAll(".modal .actionButtons .actionButtonYes").forEach((element)=>element.addEventListener("click",callbackYes));
    document.querySelectorAll(".modal .actionButtons .actionButtonNo").forEach((element)=>element.addEventListener("click",callbackNo)); 
    
}

const alertMessageToUser = function(message){
    
    console.log("reached alertMessageToUser");

    turnOnGreyArea();
    
    const modal = document.createElement("div");
    modal.className = "modal";

    const alertImage = document.createElement("div");
    alertImage.className = "alertImage";
    modal.appendChild(alertImage);

    const imageElement = document.createElement("img");
    imageElement.className = "image";
    imageElement.src = URL_PUBLIC + "/images/" + "warning-2.gif";
    imageElement.alt = "warning image";
    imageElement.setAttribute("source","https://icons8.com/animated-icons/warning-2");
    alertImage.appendChild(imageElement);

    const modalText = document.createElement("div");
    modalText.className = "modalText";
    modalText.textContent = message;
    modal.appendChild(modalText);

    const actionButtons = document.createElement("div");
    actionButtons.className = "actionButtons";
    modal.appendChild(actionButtons);

    const actionButtonOk = document.createElement("div");
    actionButtonOk.className = "actionButtonOk";
    actionButtonOk.textContent = "ok";
    actionButtons.appendChild(actionButtonOk);

    document.body.appendChild(modal);

    document.querySelectorAll(".modal .actionButtons .actionButtonOk").forEach((element)=>element.addEventListener("click",removeAlertModal));
    
}

const removeAlertModal = function(){
    document.querySelectorAll(".modal").forEach((element)=>element.remove());
    turnOffGreyArea();
}

const emptyAllItemsFromCart = function(){
        console.log("emptyAllItemsFromCart..........");
        //TODO:
        //iterate through all items from cart in order to return the quantities to storage
        //each iteration do:
        //-subtract qty from item in the cart
        //-sum qty to storage
        cart.items.forEach((element)=>{
            console.log("element being processed by emptying elements from cart:",element);
            //get quantity of this element on cart
            const qty = element.qty;
            //get id from element
            const id = element.id;
            //subtract the qty from cart
            element.qty = 0;
            //assign the store element to variable
            const storeItem = store.items.findPerId(id);
            console.log("store item identified on emptyAllItemsFromCart:",storeItem);
            //add the quantity to inventory
            storeItem.qtyOnHand += parseInt(+qty);
            console.log("store item identified on emptyAllItemsFromCart, after returning qtys:",storeItem);
        });

        //empty the items array in cart
        cart.items = [];
        cart.quantityOfDistinctItems = 0;

        //update carts
        updateCart();

        //update cart badge
        updateCartBadge();

        //update catalog
        displayStoreItems();


        //remove modal and greyArea
        turnOffGreyArea();
        document.querySelectorAll(".modal").forEach((element)=>element.remove());
}

const backToCartWithoutEmptyingIt = function(){
    console.log("backToCartWithoutEmptyingIt");
    turnOffGreyArea();
    document.querySelectorAll(".modal").forEach((element)=>element.remove());
}

const confirmEmptyingCart = function(){
    askForConfirmation("Are you sure you want to remove all items from cart?",emptyAllItemsFromCart,backToCartWithoutEmptyingIt);
}

const switchToDetails = function(){
    let itemId = event.target.getAttribute("itemId");
    console.log("switch to details is listening to this event target:", itemId);
    showElementDetails(itemId);
} // switchToDetails

/*
    bind element events at catalog page
*/
const bindElementsOnCatalog = ()=>{
    document.querySelectorAll(".storeItemAddAmountToCartColumn").forEach((element)=>element.addEventListener("click",addAmountToGoToCart,false));
    document.querySelectorAll(".storeItemSubtractAmountFromCartColumn").forEach((element)=>element.addEventListener("click",subtractAmountToGoToCart,false));
    //bind events to menu 
    document.querySelector("nav#menuIcon").addEventListener("click",mainMenuToggle,false);
    document.querySelector("nav#mainMenu #closeMenu").addEventListener("click",mainMenuHide,false);
    //bind click to cart icon
    document.querySelector("nav#cart").addEventListener("click",cartMenuToggle,false);
    //bind close cart menu button
    document.querySelector("#cartMenuActionButtons #closeCartMenu").addEventListener("click",cartMenuHide,false);
    //bind add to cart button
    document.querySelectorAll(".storeItemAddToCartColumn").forEach((element)=>{element.addEventListener("click",addItemToCart)});
    //bind to switch to cart
    document.querySelectorAll(".goToCart").forEach((element)=>element.addEventListener("click",switchToCart));
    //bind to switch to catalog
    document.querySelectorAll(".goToHome,.goToCatalog").forEach((element)=>element.addEventListener("click",switchToCatalog));
    //bind to switch to currency
    document.querySelectorAll(".goToCurrency").forEach((element)=>element.addEventListener("click",switchToCurrency));
    //bind to switch to checkout
    document.querySelectorAll(".goToCheckout").forEach((element)=>element.addEventListener("click",switchToCheckout));
    //bind to emptyCart
    document.querySelectorAll(".actionEmptyCart").forEach((element)=>element.addEventListener("click",confirmEmptyingCart));
    //bind show more of catalog button
    document.querySelectorAll(".moreOfThis").forEach((element)=>element.addEventListener("click",switchToDetails));
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