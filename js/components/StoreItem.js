const StoreItem = class {
    constructor(id,name,price,qtyOnHand,maxPerCustomer,category,costOfShipping,reviews,description,image){
        this.id = id; //String - the id of the product
        this.name = name; //String - the name of the product
        this.price = price; //Float - the price of the item
        this.qtyOnHand = qtyOnHand; //Int - the amount of the item available
        this.maxPerCustomer = maxPerCustomer; //Int - the max amount that can be added to cart
        this.category = category; //String - the category of the item
        this.costOfShipping = costOfShipping; //Float - the cost of shipping
        this.reviews = reviews; //Array - containing some reviews (strings)
        this.description = description; //String - the description of the product
        this.image = image; //String - link to the image file
    }

}