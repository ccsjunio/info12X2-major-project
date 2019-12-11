function updateTime (){
    //executes only if the page is already initialized
    if(!initialized) return false;
    date = new Date();
    currentTime = new Intl.DateTimeFormat('en-US',options).format(date);
    currentTimeElements = document.querySelectorAll("div.currentTime");
    currentTimeElements.forEach((element)=>element.innerHTML =  currentTime);
}//end of function updateTime