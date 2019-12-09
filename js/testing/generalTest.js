const generalTest = function(){
    //test the instantiation of the object Store Item
    try{
        var storeItem = new StoreItem();
        console.log("storeItem instance=>",storeItem);
    } catch(e){
        console.log("Exception on creation of StoreItem! Follow statement",e);
    }
    delete storeItem;

     //test the instantiation of the object Cart Item
     try{
         var cartItem = new CartItem();
         console.log("cartItem instance=>",cartItem);
     } catch(e){
         console.log("Exception on creation of CartItem! Follow statement",e);
     }
     delete cartItem;

     //test the existance of current time
     console.log("current time:", currentTime);
}