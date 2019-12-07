//TODO: Fix check of max qty of items per customer when adding from catalog
//Now it is not considering how many items are in the cart already

//create global variables
let storeItems = []; //empty array to have the store items
let cartItems = []; //empty array to have the cart items
let cart = new Cart(); //create a new Cart for the User
let store = new Store(); //create a new Store for the app
let greyArea = new GreyArea(); //create a new grey area block
let menu = new Menu();
let catalogDisplay = new CatalogDisplay("catalogList")
let currencyInformation = {
    "currencySymbol":"CAD",
    "currencyName":"Canadian Dollar",
    "currencyRate":1,
    "currencyTaxRate":0.13
}

//section elements on the page - initialization of global variables
//assign section catalog to variable
let catalogSectionElement;
//assign section cart to variable
let cartSectionElement;
//assign section currency to variable
let currencySectionElement;
//assign section checkout to variable
let checkoutSectionElement;
//assign section details to variable
let detailsSectionElement;
//assign section sources to variable
let sourcesSectionElement;

let cartMenu;
let mainMenu;

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
let initialized = false;

//initialize the current time and a timeout to update it each second
let date = new Date();
let options = {weekday:'short',year:'numeric',month:'short', day:'numeric', hour: 'numeric', minute: 'numeric'};
let currentTime = new Intl.DateTimeFormat('en-US',options).format(date); //variable that will store the current date and time;
let currentTimeElements;
let timer = window.setInterval(updateTime,1000*60);

//the storage variable is a global defined by the inclusion of the file before main.js on index.html

const initialize = () => {
    //call testing for main functionalities
    generalTest();

    //populate categories filter
    populateCatalogFilter();
    populateCurrencyDropBox();
    //TODO: The displayStore rewrite everything on the list, erasing the binds. remake all catalog binds as a function to execute inside displayStoreItems
    displayStoreItems();
    //section elements on the page
    //assign section catalog to variable
    catalogSectionElement = document.querySelector("section#catalogSection");
    //assign section cart to variable
    cartSectionElement = document.querySelector("section#cartSection");
    //assign section currency to variable
    currencySectionElement = document.querySelector("section#currencySection");
    //assign section checkout to variable
    checkoutSectionElement = document.querySelector("section#checkoutSection");
    //assign details section to variable
    

    //assign menus to variables
    cartMenu = document.querySelector("nav#cartMenu");
    mainMenu = document.querySelector("nav#mainMenu");

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
    //update cart menu
    updateCartMenu();
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
        nameColumn.textContent = item.name.substr(0,50) + (item.name.length>50 ? "..." : "");
        row.appendChild(nameColumn);

        let moreSpan = document.createElement("span");
        moreSpan.className = "moreOfThis";
        moreSpan.textContent = "more";
        moreSpan.setAttribute("itemId",item.id);
        nameColumn.appendChild(moreSpan);
        
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
        if(item.qtyOnHand===0||addToCartColumn.getAttribute("qtyToCart")===0){
            addToCartColumn.setAttribute("disabled",true);
        }
        row.appendChild(addToCartColumn);

        let addAmountToCartColumn = document.createElement("div");
        addAmountToCartColumn.className = "storeItemColumn storeItemAddAmountToCartColumn";
        addAmountToCartColumn.setAttribute("itemId",item.id);
        addAmountToCartColumn.innerHTML = `<li itemId='${item.id}' class='material-icons'>add</i>`;
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
    }//if( qty == qtyOnHand - 1 )
}

const addItemToCart = function(){
    //console.log("addItemToCart");
    //console.log("this=",this);
    let itemId = this.getAttribute("itemId");
    let storageItem = store.items.findPerId(itemId);
    let qty = parseInt(this.getAttribute("qtytocart"));
    //console.log(`asked to add item with item ID ${itemId} and qty ${qty} - element:`,storageItem);
    //following requirements
    let cartItem = new CartItem();
    cartItem.id = itemId;
    cartItem.price = storageItem.price;
    cartItem.qty = qty;
    cartItem.shipping = storageItem.costOfShipping;
    console.log(`item to add to cart:`,cartItem);
    let resultFromCart = cart.addItem(cartItem);
    //console.log("resultFromCart=",resultFromCart);
    if(resultFromCart.success){
        //update cart badge
        updateCartBadge();
        //update items available in storage
        store.subtractQuantityOnHand(itemId,qty);
        //console.log("store=",store);
        //update markup of element in items available
        catalogDisplay.updateStorageInformation(itemId,storageItem.qtyOnHand);
        updateCartMenu();
        document.querySelector(`.storeItemAddToCartColumn[itemId='${itemId}']`).setAttribute('qtyToCart',0);
        document.querySelector(`.storeItemAmountToCartColumn[itemId='${itemId}'] .qtyNumber`).textContent = 0;
    }//if(resultFromCart.success)
}

const updateCartBadge = function (){
    //update cart badge
    let cartBadge = document.getElementById("cartBadge");
    cartBadge.textContent = cart.quantityOfDistinctItems;
    if(cart.quantityOfDistinctItems===0){
        cartBadge.setAttribute("style","display:none;");
    } else {
        cartBadge.setAttribute("style","display:block;");
    }
    
}

//toggling elements

const toggleMenuVisibility = function(){
        
    menu.isVisible = !menu.isVisible;
    
    if(menu.isVisible){
        //hide any other menus that are visible
        let cartMenuElement = document.getElementById("cartMenu");
        cartMenuElement.setAttribute("style","display:none;");
        cart.isVisible = false;

        document.getElementById("mainMenu").setAttribute("style","display:block;");
        turnOnGreyArea();
        
    } else {
        document.getElementById("mainMenu").setAttribute("style","display:none;");
        turnOffGreyArea();
    }
        
}

const toggleCartMenuVisibility = function(){
    
    cart.isVisible = !cart.isVisible;

    if(cart.isVisible){
        //hide any other menus that are visible
        let mainMenuElement = document.getElementById("mainMenu");
        mainMenuElement.setAttribute("style","display:none;");
        menu.isVisible = false;

        document.getElementById("cartMenu").setAttribute("style","display:block;");
        turnOnGreyArea();
        
    } else {
        document.getElementById("cartMenu").setAttribute("style","display:none;");
        turnOffGreyArea();
    }      
}

const turnOnGreyArea = function (){
    let greyAreaElement = document.getElementById("greyArea");
    greyAreaElement.setAttribute("style","display:block;min-height:"+document.body.clientHeight+"px");
    greyArea.isVisible = true;
}

const turnOffGreyArea = function (){
    let greyAreaElement = document.getElementById("greyArea");
    greyAreaElement.setAttribute("style","display:none");
    greyArea.isVisible = false;
}

/*
    Though the name is updateCartMenu, this function also update carts
    because it makes calculations that are the same for the cart itself
*/
const updateCartMenu = function(){
    //assign cart menu items area to constant
    const cartItemsAreaMenu = document.querySelector("#cartMenuContainer #cartMenuItems");
    //assign cart items area to constant
    const cartItemsArea = document.querySelector("#cartContainer #cartItems");

    //total amount before taxes, for total cart amount calculation
    const totalAmountBeforeTaxes = parseFloat(cart.totalAmountBeforeTaxes).toFixed(2);
    if(cart.items.length===0){

        //for cart menu
        document.querySelector("#cartMenuContainer #messageEmpty").setAttribute("style","display:block;");
        document.querySelector("#cartMenuContainer #cartMenuActionButtons").setAttribute("style","display:none;");
        document.querySelector("#cartMenuContainer #openCart").setAttribute("style","display:none;");
        document.querySelector("#cartMenuContainer #emptyCart").setAttribute("style","display:none;");
        document.querySelector("#cartMenuContainer #cartMenuItems").setAttribute("style","display:none;");

        //for cart page
        document.querySelector("#cartContainer #messageEmptyCart").setAttribute("style","display:block;");
        document.querySelector("#cartContainer #cartActionButtons").setAttribute("style","display:none;");
        document.querySelector("#cartContainer #openCheckout").setAttribute("style","display:none;");
        document.querySelector("#cartContainer #emptyAllCart").setAttribute("style","display:none;");
        document.querySelector("#cartContainer #cartItems").setAttribute("style","display:none;");
        document.querySelector("#cartContainer #cartHeader").setAttribute("style","display:none;");

    } else {

        //clean menu area
        cartItemsAreaMenu.innerHTML = "";
        cartItemsArea.innerHTML = "";

        //iterate through each item of cart and update cart menu and cart containers
        cart.items.forEach((element)=>{

            console.log("in updateCartMenu, item being processed: ", element);
            
            //create a container for the cart item
            let containerMenu = document.createElement("div");
            let container = document.createElement("div");
            containerMenu.className = "cartMenuItem";
            container.className = "cartItem";
            container.setAttribute("itemId",element.id);
            container.setAttribute("qty",element.qty);
            
            //qtyColumn for the cart menu
            let qtyColumnMenu = document.createElement("div");
            qtyColumnMenu.className = "qtyColumn";
            qtyColumnMenu.textContent = element.qty;

            containerMenu.appendChild(qtyColumnMenu);

            //qtyColumn for the cart will have qty and buttons to alter, in the case of the cart
            let qtyColumn = document.createElement("div");
            qtyColumn.className = "qtyColumn";
            qtyColumn.setAttribute("itemId",element.id);
            qtyColumn.setAttribute("qty",element.qty);
            //row to show the quantity
            let qtyColumnInformation = document.createElement("div");
            qtyColumnInformation.className = "qtyColumnInformation";
            qtyColumnInformation.textContent = element.qty;
            qtyColumnInformation.setAttribute("itemId",element.id);
            qtyColumnInformation.setAttribute("qty",element.qty);
            qtyColumn.appendChild(qtyColumnInformation);
            //row to contain add and subtract items
            let qtyColumnAddSubtractContainer = document.createElement("div");
            qtyColumnAddSubtractContainer.className = "qtyColumnAddSubtractContainer";
            qtyColumn.appendChild(qtyColumnAddSubtractContainer);
            let qtyColumnAdd = document.createElement("div");
            qtyColumnAdd.className = "qtyColumnAdd";
            qtyColumnAdd.textContent = "+";
            qtyColumnAdd.setAttribute("itemId",element.id);
            qtyColumnAdd.setAttribute("qty",element.qty);
            qtyColumnAddSubtractContainer.appendChild(qtyColumnAdd);
            let qtyColumnSubtract = document.createElement("div");
            qtyColumnSubtract.className = "qtyColumnSubtract";
            qtyColumnSubtract.textContent = "-";
            qtyColumnSubtract.setAttribute("itemId",element.id);
            qtyColumnSubtract.setAttribute("qty",element.qty);
            qtyColumnAddSubtractContainer.appendChild(qtyColumnSubtract);
            //row to remove button
            let qtyColumnRemove = document.createElement("div");
            qtyColumnRemove.className = "qtyColumnRemove";
            qtyColumnRemove.textContent = "delete";
            qtyColumnRemove.setAttribute("itemId",element.id);
            qtyColumnRemove.setAttribute("qty",element.qty);
            qtyColumn.appendChild(qtyColumnRemove);
            
            container.appendChild(qtyColumn);

            let nameColumnMenu = document.createElement("div");
            let nameColumn = document.createElement("div");

            let elementName = store.items.findPerId(element.id).name;

            nameColumnMenu.className = "nameColumn";
            nameColumnMenu.textContent = elementName.substr(0,30) + (elementName.length>30?"...":"");
            nameColumn.className = "nameColumn";
            nameColumn.textContent = elementName;
            
            containerMenu.appendChild(nameColumnMenu);
            container.appendChild(nameColumn);

            let imageColumn = document.createElement("div");
            let imageLink = store.items.findPerId(element.id).image;
            let imageElement = document.createElement("img");
            imageElement.src = URL_PUBLIC + "/images/"+imageLink;
            imageElement.alt = "image of " + nameColumn.textContent;
            imageColumn.className = "imageColumn";
            imageColumn.appendChild(imageElement);
                    
            container.appendChild(imageColumn);

            let priceColumnMenu = document.createElement("div");
            let priceColumn = document.createElement("div");

            priceColumnMenu.className = "priceColumn";
            priceColumn.className = "priceColumn";

            let elementPrice = currencyInformation.currencySymbol + "$" + (parseFloat(element.price) * parseFloat(currencyInformation.currencyRate) * parseInt(element.qty)).toFixed(2);

            priceColumnMenu.textContent = elementPrice 
            priceColumn.textContent = elementPrice;
            
            containerMenu.appendChild(priceColumnMenu);
            container.appendChild(priceColumn);

            cartItemsAreaMenu.appendChild(containerMenu);
            cartItemsArea.appendChild(container);

        });

        //print total amount before taxes
        let totalAmountBeforeTaxesContainerMenu = document.createElement("div");
        let totalAmountBeforeTaxesContainer = document.createElement("div");
        totalAmountBeforeTaxesContainerMenu.className = "cartMenuItem totalAmountBeforeTaxes";
        totalAmountBeforeTaxesContainer.className = "cartItem totalAmountBeforeTaxes";

        let totalAmountBeforeTaxesNameMenu = document.createElement("div");
        let totalAmountBeforeTaxesName = document.createElement("div");
        totalAmountBeforeTaxesNameMenu.className = "nameColum";
        totalAmountBeforeTaxesNameMenu.textContent = "total amount before taxes";
        totalAmountBeforeTaxesName.className = "nameColum";
        totalAmountBeforeTaxesName.textContent = "total amount before taxes";
        
        totalAmountBeforeTaxesContainerMenu.appendChild(totalAmountBeforeTaxesNameMenu);
        totalAmountBeforeTaxesContainer.appendChild(totalAmountBeforeTaxesName);

        let totalAmountBeforeTaxesPriceMenu = document.createElement("div");
        let totalAmountBeforeTaxesPrice = document.createElement("div");
        totalAmountBeforeTaxesPriceMenu.className = "priceColumn";
        totalAmountBeforeTaxesPriceMenu.textContent = currencyInformation.currencySymbol + "$" + (parseFloat(+cart.totalAmountBeforeTaxes) * parseFloat(currencyInformation.currencyRate)).toFixed(2);
        totalAmountBeforeTaxesPrice.className = "priceColumn";
        totalAmountBeforeTaxesPrice.textContent = totalAmountBeforeTaxesPriceMenu.textContent;
        
        totalAmountBeforeTaxesContainerMenu.appendChild(totalAmountBeforeTaxesPriceMenu);
        totalAmountBeforeTaxesContainer.appendChild(totalAmountBeforeTaxesPrice);

        cartItemsAreaMenu.appendChild(totalAmountBeforeTaxesContainerMenu);
        cartItemsArea.appendChild(totalAmountBeforeTaxesContainer);

        //print total amount of shipping
        let totalAmountOfShippingContainerMenu = document.createElement("div");
        let totalAmountOfShippingContainer = document.createElement("div");
        totalAmountOfShippingContainerMenu.className = "cartMenuItem totalShipping";
        totalAmountOfShippingContainer.className = "cartItem totalShipping";

        let totalAmountOfShippingNameMenu = document.createElement("div");
        let totalAmountOfShippingName = document.createElement("div");
        totalAmountOfShippingNameMenu.className = "nameColum";
        totalAmountOfShippingNameMenu.textContent = "total shipping";
        totalAmountOfShippingName.className = "nameColum";
        totalAmountOfShippingName.textContent = "total shipping";
        
        totalAmountOfShippingContainerMenu.appendChild(totalAmountOfShippingNameMenu);
        totalAmountOfShippingContainer.appendChild(totalAmountOfShippingName);

        let totalAmountOfShippingPriceMenu = document.createElement("div");
        let totalAmountOfShippingPrice = document.createElement("div");
        totalAmountOfShippingPriceMenu.className = "priceColumn";
        totalAmountOfShippingPriceMenu.textContent = currencyInformation.currencySymbol + "$" + (parseFloat(+cart.totalShipping) * parseFloat(currencyInformation.currencyRate)).toFixed(2);
        totalAmountOfShippingPrice.className = "priceColumn";
        totalAmountOfShippingPrice.textContent = totalAmountOfShippingPriceMenu.textContent;
        
        totalAmountOfShippingContainerMenu.appendChild(totalAmountOfShippingPriceMenu);
        totalAmountOfShippingContainer.appendChild(totalAmountOfShippingPrice);

        cartItemsAreaMenu.appendChild(totalAmountOfShippingContainerMenu);
        cartItemsArea.appendChild(totalAmountOfShippingContainer);

        //print total amount of taxes
        let totalAmountOfTaxesContainerMenu = document.createElement("div");
        let totalAmountOfTaxesContainer = document.createElement("div");
        totalAmountOfTaxesContainerMenu.className = "cartMenuItem totalTaxes";
        totalAmountOfTaxesContainer.className = "cartItem totalTaxes";

        let totalAmountOfTaxesNameMenu = document.createElement("div");
        let totalAmountOfTaxesName = document.createElement("div");
        totalAmountOfTaxesNameMenu.className = "nameColum";
        totalAmountOfTaxesNameMenu.textContent = "total taxes (incl shipping)";
        totalAmountOfTaxesName.className = "nameColum";
        totalAmountOfTaxesName.textContent = "total taxes (incl shipping)";
        
        totalAmountOfTaxesContainerMenu.appendChild(totalAmountOfTaxesNameMenu);
        totalAmountOfTaxesContainer.appendChild(totalAmountOfTaxesName);

        let totalAmountOfTaxesPriceMenu = document.createElement("div");
        let totalAmountOfTaxesPrice = document.createElement("div");
        totalAmountOfTaxesPriceMenu.className = "priceColumn";
        totalAmountOfTaxesPriceMenu.textContent = currencyInformation.currencySymbol + "$" + (parseFloat(+cart.totalTaxes)* parseFloat(currencyInformation.currencyRate)).toFixed(2);
        totalAmountOfTaxesPrice.className = "priceColumn";
        totalAmountOfTaxesPrice.textContent = totalAmountOfTaxesPriceMenu.textContent;
        
        totalAmountOfTaxesContainerMenu.appendChild(totalAmountOfTaxesPriceMenu);
        totalAmountOfTaxesContainer.appendChild(totalAmountOfTaxesPrice);

        cartItemsAreaMenu.appendChild(totalAmountOfTaxesContainerMenu);
        cartItemsArea.appendChild(totalAmountOfTaxesContainer);

        //print total amount of cart
        let totalAmountOfCartContainerMenu = document.createElement("div");
        let totalAmountOfCartContainer = document.createElement("div");
        totalAmountOfCartContainerMenu.className = "cartMenuItem totalCart";
        totalAmountOfCartContainer.className = "cartItem totalCart";

        let totalAmountOfCartNameMenu = document.createElement("div");
        let totalAmountOfCartName = document.createElement("div");
        totalAmountOfCartNameMenu.className = "nameColum";
        totalAmountOfCartNameMenu.textContent = "total due";
        totalAmountOfCartName.className = "nameColum";
        totalAmountOfCartName.textContent = "total due";
        
        totalAmountOfCartContainerMenu.appendChild(totalAmountOfCartNameMenu);
        totalAmountOfCartContainer.appendChild(totalAmountOfCartName);

        let totalAmountOfCartPriceMenu = document.createElement("div");
        let totalAmountOfCartPrice = document.createElement("div");
        totalAmountOfCartPriceMenu.className = "priceColumn";
        totalAmountOfCartPriceMenu.textContent = currencyInformation.currencySymbol + "$" + (parseFloat(+cart.totalDue)* parseFloat(currencyInformation.currencyRate)).toFixed(2);
        totalAmountOfCartPrice.className = "priceColumn";
        totalAmountOfCartPrice.textContent = totalAmountOfCartPriceMenu.textContent;
        
        totalAmountOfCartContainerMenu.appendChild(totalAmountOfCartPriceMenu);
        totalAmountOfCartContainer.appendChild(totalAmountOfCartPrice);

        cartItemsAreaMenu.appendChild(totalAmountOfCartContainerMenu);
        cartItemsArea.appendChild(totalAmountOfCartContainer);

        let paymentButton = document.createElement("div");
        paymentButton.id="payPalPaymentCanvas";
        paymentButton.className = "cartItem";
        cartItemsArea.appendChild(paymentButton);
        
        paypal.Buttons({
            createOrder: function(data, actions) {
              // This function sets up the details of the transaction, including the amount and line item details.
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: (parseFloat(+cart.totalDue)* parseFloat(currencyInformation.currencyRate))
                  }
                }]
              });
            },
            onApprove: function(data, actions) {
              // This function captures the funds from the transaction.
              return actions.order.capture().then(function(details) {
                // This function shows a transaction success message to your buyer.
                alert('Transaction completed by ' + details.payer.name.given_name);
              });
            }
          }).render('#payPalPaymentCanvas');
        

        //bind actions to buttons
        //bind action to remove item from cart
        document.querySelectorAll(`.cartItem .qtyColumnRemove`).forEach((element)=>element.addEventListener("click",askToRemoveItemFromCart));
        //TODO: bind action to add quantity to item to cart
        document.querySelectorAll(`.cartItem .qtyColumnAdd`).forEach((element)=>element.addEventListener("click",incrementQtyToItemFromCart));
        //TODO: bind action to subtract quantity from item to cart
        document.querySelectorAll(`.cartItem .qtyColumnSubtract`).forEach((element)=>element.addEventListener("click",decrementQtyFromItemFromCart));

        //for cart menu
        document.querySelector("#cartMenuContainer #messageEmpty").setAttribute("style","display:none;");
        document.querySelector("#cartMenuContainer #cartMenuActionButtons").setAttribute("style","display:flex;");
        document.querySelector("#cartMenuContainer #openCart").setAttribute("style","display:block;");
        document.querySelector("#cartMenuContainer #emptyCart").setAttribute("style","display:block;");
        document.querySelector("#cartMenuContainer #cartMenuItems").setAttribute("style","display:flex;");

        //for cart
        document.querySelector("#cartContainer #messageEmptyCart").setAttribute("style","display:none;");
        document.querySelector("#cartContainer #cartActionButtons").setAttribute("style","display:flex;");
        document.querySelector("#cartContainer #openCheckout").setAttribute("style","display:block;");
        document.querySelector("#cartContainer #emptyAllCart").setAttribute("style","display:block;");
        document.querySelector("#cartContainer #cartItems").setAttribute("style","display:flex;");
        document.querySelector("#cartContainer #cartHeader").setAttribute("style","display:block;");
    }

    bindElementsOnCatalog();

}

const incrementQtyToItemFromCart = function(){
    const itemId = event.target.getAttribute("itemId");
    const qty = parseInt(+event.target.getAttribute("qty"));
    const storageElement = store.items.findPerId(itemId);
    const cartElement = cart.items.findPerId(itemId);
    console.log(`incrementQtyToItemFromCart - itemId=${itemId} - qty=${qty}`);
    if((+qty+1)>storageElement.maxPerCustomer){
        alertMessageToUser(`this item has a maximum of ${storageElement.maxPerCustomer} units per customer. sorry!`);
        return false;
    } else {
        //increase qty of item on cart
        cart.incrementItemQty(itemId);
        //decrease qty on storage
        storageElement.qtyOnHand--;
        //update cart
        updateCartMenu();
        //qty of distinct items on cart do not change because this is the same item
        //update badge
        updateCartBadge();
        //update catalog
        displayStoreItems();
    }

}

const decrementQtyFromItemFromCart = function(){
    const itemId = event.target.getAttribute("itemId");
    const qty = parseInt(+event.target.getAttribute("qty"));
    const storageElement = store.items.findPerId(itemId);
    const cartElement = cart.items.findPerId(itemId);
    console.log(`decrementQtyFromItemFromCart - itemId=${itemId} - qty=${qty}`);
    if((+qty-1)==0){
        document.querySelector(`.cartItem[itemId='${itemId}']`).setAttribute("toBeRemoved",true);
        askForConfirmation(`By setting the quantity to zero you will remove the item from cart. are you sure you want to do that?`,removeItemFromCart,dontRemoveItemFromCart);
        return false;
    } else {
        //increase qty of item on cart
        cart.decrementItemQty(itemId);
        //decrease qty on storage
        storageElement.qtyOnHand++;
        //update cart
        updateCartMenu();
        //qty of distinct items on cart do not change because this is the same item
        //update badge
        updateCartBadge();
        //update catalog
        displayStoreItems();
    }

}

const askToRemoveItemFromCart = function(){
    const itemId = event.target.getAttribute("itemId");
    const qty = parseInt(+event.target.getAttribute("qty"));
    const elementName = store.items.findPerId(itemId).name;
    //tag the element to be removed
    document.querySelector(`.cartItem[itemId='${itemId}']`).setAttribute("toBeRemoved",true);

    askForConfirmation(`Are you sure you want to remove ${qty} units of ${elementName} from the cart?`,removeItemFromCart,dontRemoveItemFromCart);
}

const dontRemoveItemFromCart = function(){
    document.querySelectorAll(`.cartItem[toBeRemoved=true]`).forEach((element)=>element.removeAttribute("toBeRemoved"));
    document.querySelectorAll(".modal").forEach((element)=>element.remove());
    turnOffGreyArea();
}

const removeItemFromCart = function(){

    const elementToBeRemoved = document.querySelector(`.cartItem[toBeRemoved=true]`);
    const itemId = elementToBeRemoved.getAttribute("itemId");
    const qty = parseInt(+elementToBeRemoved.getAttribute("qty"));
    console.log("itemId retrieved by removeItemFromCart:",itemId);
    console.log("qty retrieved by removeItemFromCart:",qty);
    //remove item from Cart TODO: transfer method to class Cart
    cart.items.splice(cart.items.findIndex((element)=>element.id==itemId),1);
    //update cart - TODO: improve by not updating the whole card
    updateCartMenu();
    //update distinct qty on cart
    cart.quantityOfDistinctItems --;
    //update cart badge
    updateCartBadge();
    //update store qty
    console.log("store items find per id ",store.items.findPerId(itemId));
    store.items.findPerId(itemId).qtyOnHand += +qty;
    
    //update catalog
    displayStoreItems();

    //remove modal and grey area
    document.querySelectorAll(".modal").forEach((element)=>element.remove());
    turnOffGreyArea();

}

const switchToCart = function(){

    //control visibilities
    catalogSectionElement.style.display = "none";
    cartSectionElement.style.display = "block";
    currencySectionElement.style.display = "none";
    checkoutSectionElement.style.display = "none";
    wrapUpSwitch();

}//end of switchToCart

const switchToCatalog = function(){
    
    //control visibilities
    catalogSectionElement.style.display = "block";
    cartSectionElement.style.display = "none";
    currencySectionElement.style.display = "none";
    checkoutSectionElement.style.display = "none";
    wrapUpSwitch();

}//end of switchToCatalog

const switchToCurrency = function(){
    
    //control visibilities
    catalogSectionElement.style.display = "none";
    cartSectionElement.style.display = "none";
    currencySectionElement.style.display = "block";
    checkoutSectionElement.style.display = "none";
    wrapUpSwitch();

}//end of switchToCurrency

const switchToCheckout = function(){
    
    //control visibilities
    catalogSectionElement.style.display = "none";
    cartSectionElement.style.display = "none";
    currencySectionElement.style.display = "none";
    checkoutSectionElement.style.display = "block";
    wrapUpSwitch();

}//end of switchToCurrency

const wrapUpSwitch = function(){
    turnOffGreyArea();
    cartMenu.style.display = "none";
    mainMenu.style.display = "none";
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
        updateCartMenu();

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
    let element = event.target;
    console.log("switch to details is listening to this event target:", element);
} // switchToDetails

/*
    bind element events at catalog page
*/
const bindElementsOnCatalog = ()=>{
    document.querySelectorAll(".storeItemAddAmountToCartColumn").forEach((element)=>element.addEventListener("click",addAmountToGoToCart,false));
    document.querySelectorAll(".storeItemSubtractAmountFromCartColumn").forEach((element)=>element.addEventListener("click",subtractAmountToGoToCart,false));
    //bind events to menu 
    document.querySelector("nav#menuIcon").addEventListener("click",toggleMenuVisibility,false);
    document.querySelector("nav#mainMenu #closeMenu").addEventListener("click",toggleMenuVisibility,false);
    //bind click to cart icon
    document.querySelector("nav#cart").addEventListener("click",toggleCartMenuVisibility,false);
    //bind close cart menu button
    document.querySelector("#cartMenuActionButtons #closeCartMenu").addEventListener("click",toggleCartMenuVisibility,false);
    //bind add to cart button
    document.querySelectorAll(".storeItemAddToCartColumn").forEach((element)=>element.addEventListener("click",addItemToCart));
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