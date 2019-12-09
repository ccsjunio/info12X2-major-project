const CatalogList = class{

    constructor(displayElement){
        this.displayElement = document.getElementById(displayElement);
        this.items = [];
        this.isVisible = false;
    }

    updateStorageInformation(itemId,qty){
        document.querySelector(`.storeItemQtyOnHandColumn[itemId='${itemId}']`).textContent=+qty + " in stock";
    }

}