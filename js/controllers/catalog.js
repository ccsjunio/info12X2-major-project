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
    emptyCatalogList();

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

const emptyCatalogList = function(){
    document.getElementById("catalogList").innerHTML = "";
}