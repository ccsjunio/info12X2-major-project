//create global variables
var storeItems = []; //empty array to have the store items
var cartItems = []; //empty array to have the cart items
var cart = new Cart(); //create a new Cart for the User
var store = new Store(); //create a new Store for the app

//call function to add initial items to store
if(!(addInitialItemsToStore().success)) alert ("Problems on load initial storage items!");
console.log("store=",store);

//state variables
var initialized = false;

//initialize the current time and a timeout to update it each second
var date = new Date();
var options = {weekday:'short',year:'numeric',month:'short', day:'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',};
var currentTime = new Intl.DateTimeFormat('en-US',options).format(date); //variable that will store the current date and time;
var currentTimeElements;
var timer = window.setInterval(updateTime,1000);

//the storage variable is a global defined by the inclusion of the file before main.js on index.html

function initialize(){
    //call testing for main functionalities
    generalTest();


    initialized = true;
}

function generalTest(){
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

function updateTime(){
    if(!initialized) return false;
    date = new Date();
    currentTime = new Intl.DateTimeFormat('en-US',options).format(date);
    currentTimeElements = document.querySelectorAll("div.currentTime");
    Array.from(currentTimeElements).forEach((element)=>element.innerHTML = currentTime);
}//end of function updateTime

function addInitialItemsToStore(){
    //the initialStorage variable is a global defined by the inclusion of the file before main.js on index.html
    try{
        initialStorage.forEach((item)=>store.addItem(item));
    } catch(error){
        return {success:false,errorMessage:error.message};
    }
    return{success:true,message:"items added with success"};

}

function generateItemCardMarkup(item){
    var card = document.createElement("div");
    card.setAttribute("class","storeItem");
    card.setAttribute("id",item.id);
    
}