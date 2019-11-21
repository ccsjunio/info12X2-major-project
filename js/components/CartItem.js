const CartItem = class {
    constructor(id, price, qty, shipping){
        this.id = id; // String - the id of the product
        this.price = price // Float - the price of the item (in Canadian Dolars)
        this.qty = qty // Int - the amount of this product in the cart
        this.shipping = shipping // Float - cost of shipping for this item
    }
}