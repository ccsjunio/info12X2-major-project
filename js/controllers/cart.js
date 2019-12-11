const addItemToCart = function(){
    this.style.backgroundColor = "white";
    window.setTimeout(()=>this.style.backgroundColor="#e49400",50);
    let itemId = this.getAttribute("itemId");
    let storageItem = store.items.findPerId(itemId);
    let qty = parseInt(this.getAttribute("qtytocart"));
    if(qty==0) {
        console.log("cannot add 0 qty to cart");
        this.disabled = "disabled";
        let provElement = document.createElement("span");
        provElement.style.color = "red";
        provElement.style.padding = "4px";
        provElement.style.fontWeight = "bolder";
        provElement.id = "provElement";
        provElement.textContent = "  how many?";
        document.querySelector(`.storeItemAddToCartColumn[itemId='${itemId}']`).appendChild(provElement);
        window.setTimeout(()=>{
            document.getElementById("provElement").remove();
            return;
        },500);
        this.removeAttribute("disabled");
        return;
    };
    //console.log(`asked to add item with item ID ${itemId} and qty ${qty} - element:`,storageItem);
    //following requirements
    //create an instance of an item for the cart
    let cartItem = new CartItem();
    cartItem.id = itemId;
    cartItem.price = storageItem.price;
    cartItem.qty = qty;
    cartItem.shipping = storageItem.costOfShipping;
    //console.log(`item to add to cart:`,cartItem);

    let resultFromCart = cart.addItem(cartItem);
    //console.log("resultFromCart=",resultFromCart);
    if(resultFromCart.success){
        //update cart badge
        updateCartBadge();
        //update items available in storage
        store.subtractQuantityOnHand(itemId,qty);
        //console.log("store=",store);
        //update markup of element in items available
        catalogList.updateStorageInformation(itemId,storageItem.qtyOnHand);
        updateCart();
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

const subtractAmountToGoToCart = function(){
    //"this" is the element clicked
    //retrieve the itemId from the product from this element
    let itemId = this.getAttribute("itemId");
    console.log("itemId=",itemId);
    let maxQtyPerCustomer = store.items.findPerId(itemId).maxPerCustomer;
    let qtyOnHand = store.items.findPerId(itemId).qtyOnHand;
    let qtyAlreadyOnCart = (cart.items.findPerId(itemId) !== undefined) ? (parseInt(+cart.items.findPerId(itemId).qty)) : 0;
    //get element of the quantity number
    let qtyElement = document.querySelector(`.storeItemAmountToCartColumn[itemId='${itemId}'] .qtyNumber`);
    let qty = parseInt(+qtyElement.innerHTML.replace(/\s+/gi,""));
    console.log(`subtract qty for item ${itemId}=`,qty);
    (qty == 0) ? qty : qty--;

    //update quantity at the page, in the respective element
    qtyElement.innerHTML = qty;

    //update attribute qty on button 'addToCart'
    document.querySelector(`.storeItemAddToCartColumn[itemId='${itemId}']`).setAttribute('qtyToCart',qty);

    if( (qty + qtyAlreadyOnCart) == maxQtyPerCustomer - 1 ){
        let maxPerCustomerElement = document.querySelector(`.storeItemMaxPerCustomerColumn[itemId='${itemId}']`);
        let classNames = maxPerCustomerElement.className.split(" ");
        console.log("classNames=",classNames)
        //TODO: Show the user how many items already in cart
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

const addAmountToGoToCart = function(){
    //"this" is the element clicked
    //retrieve the itemId from the product from this element
    
    let itemId = this.getAttribute("itemId");
    
    console.log("itemId=",itemId);
    console.log("store items find per Id = ", store.items.findPerId(itemId));
    //get the maximum amount of this item allowed per customer
    let maxQtyPerCustomer = store.items.findPerId(itemId).maxPerCustomer;
    //get the quantity on hand on storage
    let qtyOnHand = store.items.findPerId(itemId).qtyOnHand;
    //get the quantity already on cart
    let qtyAlreadyOnCart = (cart.items.findPerId(itemId) !== undefined) ? (parseInt(+cart.items.findPerId(itemId).qty)) : 0;
    //get element of the quantity number
    let qtyElement = document.querySelector(`.storeItemAmountToCartColumn[itemId='${itemId}'] .qtyNumber`);
    let qty = parseInt(+qtyElement.innerHTML.replace(/\s+/gi,""));
    console.log(`qty for item ${itemId}=`,qty);
    ( (qty + qtyAlreadyOnCart) < maxQtyPerCustomer && qty < qtyOnHand ) ? qty++ : qty;

    //update quantity at the page, in the respective element
    qtyElement.innerHTML = qty;

    //update attribute qty on button 'addToCart'
    document.querySelector(`.storeItemAddToCartColumn[itemId='${itemId}']`).setAttribute('qtyToCart',qty);

    if( (qty + qtyAlreadyOnCart) == maxQtyPerCustomer ){
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

const updateCart = function(){
    console.log("executing updateCart");
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
        document.querySelector("#cartContainer #messageEmptyCart").setAttribute("style","display:flex;");
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

            console.log("in updateCart, item being processed: ", element);
            
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

        });//end of cart.items.forEach

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

        let paymentContainer = document.createElement("div");
        cartItemsArea.appendChild(paymentContainer);
        paymentContainer.className = "cartItem paymentContainer";

        let checkOutButton = document.createElement("div");
        paymentContainer.appendChild(checkOutButton);
        checkOutButton.className = "checkOutButton";
        checkOutButton.textContent = "checkout";

        let paymentCanvas = document.createElement("div");
        paymentContainer.appendChild(paymentCanvas);
        paymentCanvas.className = "paymentCanvas";
        paymentCanvas.id = "payPalPaymentCanvas";
        paymentCanvas.setAttribute("defaultDisplayMode","block");

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
        //action to remove item from cart
        document.querySelectorAll(`.cartItem .qtyColumnRemove`).forEach((element)=>element.addEventListener("click",askToRemoveItemFromCart));
        //bind action to add quantity to item to cart
        document.querySelectorAll(`.cartItem .qtyColumnAdd`).forEach((element)=>element.addEventListener("click",incrementQtyToItemFromCart));
        //bind action to subtract quantity from item to cart
        document.querySelectorAll(`.cartItem .qtyColumnSubtract`).forEach((element)=>element.addEventListener("click",decrementQtyFromItemFromCart));
        //bind action to open checkout
        document.querySelectorAll(`.checkOutButton`).forEach((element)=>element.addEventListener("click",togglePaymentCanvas,false));

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


const togglePaymentCanvas = function(){
    console.log("togglePaymentCanvas is listening");
    document.querySelectorAll(`.paymentCanvas`).forEach((element)=>{
        element.style.display==="none" ? (showPaymentCanvas()) : (hidePaymentCanvas());
    });//end of document.querySelectorAll(`.paymentCanvas`).forEach((element)
}

const showPaymentCanvas = function(){
    document.querySelectorAll(`.paymentCanvas`).forEach((element)=>element.style.display=element.getAttribute("defaultDisplayMode"));
    
}

const hidePaymentCanvas = function(){
    document.querySelectorAll(`.paymentCanvas`).forEach((element)=>element.style.display="none");
}

const incrementQtyToItemFromCart = function(){
    console.log("executing incrementQtyToItemFromCart");
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
        updateCart();
        //qty of distinct items on cart do not change because this is the same item
        //update badge
        updateCartBadge();
        //update catalog
        displayStoreItems();
    }

}

const decrementQtyFromItemFromCart = function(){
    console.log("executing decrementQtyFromItemFromCart");
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
        updateCart();
        //qty of distinct items on cart do not change because this is the same item
        //update badge
        updateCartBadge();
        //update catalog
        displayStoreItems();
    }

}

const askToRemoveItemFromCart = function(){
    console.log("executing askToRemoveItemFromCart");
    const itemId = event.target.getAttribute("itemId");
    const qty = parseInt(+event.target.getAttribute("qty"));
    const elementName = store.items.findPerId(itemId).name;
    //tag the element to be removed
    document.querySelector(`.cartItem[itemId='${itemId}']`).setAttribute("toBeRemoved",true);

    askForConfirmation(`Are you sure you want to remove ${qty} units of ${elementName} from the cart?`,removeItemFromCart,dontRemoveItemFromCart);
}

const dontRemoveItemFromCart = function(){
    console.log("executing dontRemoveItemFromCart");
    document.querySelectorAll(`.cartItem[toBeRemoved=true]`).forEach((element)=>element.removeAttribute("toBeRemoved"));
    document.querySelectorAll(".modal").forEach((element)=>element.remove());
    turnOffGreyArea();
}

const removeItemFromCart = function(){

    console.log("executing removeItemFromCart");
    const elementToBeRemoved = document.querySelector(`.cartItem[toBeRemoved=true]`);
    const itemId = elementToBeRemoved.getAttribute("itemId");
    const qty = parseInt(+elementToBeRemoved.getAttribute("qty"));
    console.log("itemId retrieved by removeItemFromCart:",itemId);
    console.log("qty retrieved by removeItemFromCart:",qty);
    //remove item from Cart TODO: transfer method to class Cart
    console.log("cart=",cart.removeItem);
    cart.removeItem(itemId);
    //update cart - TODO: improve by not updating the whole card
    updateCart();
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