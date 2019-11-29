const CatalogDisplay = class{

    constructor(displayElement){
        this.displayElement = document.getElementById(displayElement);
        this.items = [];  
    }

    updateStorageInformation(itemId,qty){
        document.querySelector(`.storeItemQtyOnHandColumn[itemId='${itemId}']`).textContent=+qty + " in stock";
    }




}