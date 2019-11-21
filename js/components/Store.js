const Store = class {
    constructor(){
        this.items = [];
    }

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

    updateItem(itemId){

    }

    retrieveItemData(itemId){

    }

    retrieveAllItems(){

    }

    removeItem(itemId){


    }
}