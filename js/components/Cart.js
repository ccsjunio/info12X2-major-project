const Cart = class {
    constructor(){
        this.items = [];
        this.quantityOfDistinctItems = 0;
        this.totalAmountBeforeTaxes = 0;
        this.totalTaxes = 0;
        this.totalShipping = 0;
        this.isVisible = false; //state of visibility of cart menu at screen
    }

    addItem(element){
        console.log("element received from method addItem in Cart:", element);
        this.items.push(element);
        console.log("this.items after pushing in method addItem in Cart:",this.items);
        this.quantityOfDistinctItems ++;
        //the remove duplicates is necessary because a user can decide to
        //add more qty from the same item after some time, instead of 
        //going to the cart and change the qty
        console.log("in Cart.addItem, berfore removeDuplicateItems:",this.items);
        this.removeDuplicateItems();
        console.log("in Cart.addItem, after removeDuplicateItems:",this.items);
        this.updateTotalPrice();
        return {success:true,items:this.items,quantityOfDistinctItems:this.quantityOfDistinctItems,isVisible:this.isVisible};
    }

    incrementItemQty(itemId){
        let element = this.items[this.items.findIndex((element)=>element.id==itemId)];
        element.qty ++;
        this.updateTotalPrice();
        return {success:true,items:this.items,quantityOfDistinctItems:this.quantityOfDistinctItems,isVisible:this.isVisible};
    }

    decrementItemQty(itemId){
        let element = this.items[this.items.findIndex((element)=>element.id==itemId)];
        element.qty --;
        this.updateTotalPrice();
        return {success:true,items:this.items,quantityOfDistinctItems:this.quantityOfDistinctItems,isVisible:this.isVisible};
    }

    removeItem(element){
        let itemId = element.id;

        return {success:true,items:this.items,quantityOfDistinctItems:this.quantityOfDistinctItems,isVisible:this.isVisible};
    }

    findItem(itemId){
        this.items.find()
    }

    removeDuplicateItems(){
        console.log("thisItems in removeDuplicateItems = ",this.items);
        let uniqueItems = [];
        //make a clone from the items, to avoid any messes an losses
        let possibleDuplicateItems = this.items.slice(0);
        console.log("possibleDuplicateItems = ", possibleDuplicateItems);
        // - possibleDuplicateItems.map(element=>element.id) create an array only with the store items ids
        // - Set enforces that no ids are duplicated and create a "set" for the items id
        // - Array.from transforms the set into an array
        // - we map the array of unique Ids and do the following:
        //   - create a temporary object for the item, finding the item in the cloned array by the itemId
        //   - update the quantity by reducing through the cloned array to sum the quantities for the instances of the element
        //uniqueItems = Array.from(new Set(possibleDuplicateItems.map(element=>element.id)));
        uniqueItems = Array.from(new Set(possibleDuplicateItems.map(element=>element.id))).map(itemId=>{
            let thisItem = possibleDuplicateItems.find((element)=>element.id == itemId );
            thisItem.qty = possibleDuplicateItems.reduce( (accumulator,currentItem)=> +accumulator + (currentItem.id==itemId?parseInt(+currentItem.qty):0),0);
            return thisItem;
        });
        console.log("uniqueItems after operation in Cart.removeDuplicateItems:",uniqueItems);
        //update the Cart items with duplicates removed
        this.items = uniqueItems.slice(0);
        this.quantityOfDistinctItems = cart.items.length;
    }

    updateTotalPrice(){
        //iterate through all items of cart to update total prices
        this.totalAmountBeforeTaxes = this.items.reduce((accumulator,currentElement)=>parseFloat(+accumulator) + parseFloat(+currentElement.price) * parseFloat(+currentElement.qty),0);
        this.totalShipping = this.items.reduce((accumulator,currentElement)=>parseFloat(+accumulator) + parseFloat(+currentElement.shipping),0);
        this.totalTaxes = this.items.reduce((accumulator,currentElement)=>parseFloat(+accumulator) + parseFloat(+currentElement.price) * parseFloat(+currentElement.qty) * parseFloat(+currencyInformation.currencyTaxRate),0);
        this.totalTaxes += this.totalShipping;
        this.totalDue = (parseFloat(this.totalAmountBeforeTaxes) + parseFloat(this.totalShipping) + parseFloat(this.totalTaxes)).toFixed(2);
    }

    updateItem(itemId){

    }

    retrieveItemData(itemId){

    }

    retrieveAllItems(){

    }

    removeItem(itemId){

        
    }

    removeAllItems(){
        
    }
}