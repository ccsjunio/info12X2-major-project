const Cart = class {
    constructor(){
        this.items = [];
        this.quantityOfItems = 0;
    }

    addItem(element,qty){
        for(let i=0;i<qty;i++){
            this.items.push(element);
        }
        this.quantityOfItems ++;
        return {success:true,items:this.items,quantityOfItems:this.quantityOfItems};
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