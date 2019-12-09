const Store = class {
    constructor(){
        this.items = [];
    }

    /************************************************************* 
    This method add an item passed through an object
    returns success true is the actions was successfull and false if not
    if not successfull returns an error message
    returns a collection of items through an object as a payload response
    Author: Carlos Cesar Ferraz
    Last update: Dec 7, 2019
    **************************************************************/
    addItem(item){
        let response = {
            success : false,
            payload : null,
            message : null,
            errorMessage : null
        };
        try{
            this.items.push(item);
        } catch(error){
            response.success = false;
            response.errorMessage = "Error on add item to store. Follow problem: " + error.message;
            return response;
        }
        response.success = true;
        response.payload = this.items;
        response.message = "Added item to Store with success";
        return response;
    }

    /************************************************************* 
    This method add a collection of items passed through an object
    returns success true is the actions was successfull and false if not
    if not successfull returns an error message
    returns a collections of the store items as an object
    Author: Carlos Cesar Ferraz
    Last update: Dec 7, 2019
    **************************************************************/
    addItems(items){
        //the initialStorage variable is a global defined by the inclusion of the file before main.js on index.html
        try{
            //use method on class Storage to add a item
            //picking items from "initialStorage"
            items.forEach((item)=>this.addItem(item));
        } catch(error){
            return {success:false,errorMessage:error.message,items:this.items};
        }
        return{success:true,message:"items added with success"};
    } //end of addItems

    updateItem(itemId){

    }

    retrieveItemData(itemId){

    }

    retrieveAllItems(){

    }

    removeItem(itemId){


    }

    subtractQuantityOnHand(itemId,qty){
        this.items.find((element)=>element.id==itemId).qtyOnHand -= qty;
    }
}