const showElementDetails = (itemId)=>{
    console.log("showing element details for itemId = ",itemId);
    console.log("details sectioj=",detailsSection);
    detailsSection.show();
    let item = store.items.findPerId(itemId);
    console.log("item retreived:",item);
    //clean the container details
    detailsSection.targetElement.innerHMTL = "";
    detailsSection.targetElement.textContent = "";
    //create details container
    let container = document.createElement("div");
    container.setAttribute("itemId",itemId);
    container.className = "container";
    detailsSection.targetElement.appendChild(container);
    
    //create name block
    let nameContainer = document.createElement("div");
    nameContainer.className = "name";
    nameContainer.textContent = item.name;
    container.appendChild(nameContainer);

    //create description block
    let descriptionContainer = document.createElement("div");
    descriptionContainer.setAttribute("itemId",itemId);
    descriptionContainer.className = "descriptionContainer";
    let descriptionContainerContents = document.createElement("span");
    descriptionContainerContents.setAttribute("itemId",itemId);
    descriptionContainerContents.className = "descriptionContainerContents";
    descriptionContainerContents.textContent = item.description.substr(0,100);
    descriptionContainerContents.setAttribute("contents",item.description);
    descriptionContainer.appendChild(descriptionContainerContents);
    let descriptionContainerMore = document.createElement("span");
    descriptionContainerMore.setAttribute("itemId",itemId);
    descriptionContainerMore.className = "more";
    descriptionContainerMore.textContent = "see more";
    descriptionContainer.appendChild(descriptionContainerMore);
    let descriptionContainerLess = document.createElement("span");
    descriptionContainerLess.setAttribute("itemId",itemId);
    descriptionContainerLess.className = "less";
    descriptionContainerLess.textContent = "see less";
    descriptionContainer.appendChild(descriptionContainerLess);
    container.appendChild(descriptionContainer);
    //bind click to more and to less
    document.querySelector(`section#detailsSection .container .descriptionContainer .more[itemId='${itemId}']`).addEventListener("click",showMoreContents,false);
    document.querySelector(`section#detailsSection .container .descriptionContainer .less[itemId='${itemId}']`).addEventListener("click",showLessContents,false);

    //create image and quantities container
    let miscContainer = document.createElement("div");
    miscContainer.classList.add("miscContainer");
    miscContainer.setAttribute("itemId",itemId);
    container.appendChild(miscContainer);

    //create image block
    let imageContainer = document.createElement("div");
    imageContainer.className = "image";
    let imageElement = document.createElement("img");
    imageElement.src = URL_PUBLIC + "/images/"+item.image;
    imageElement.alt = "image of " + item.name;
    imageContainer.appendChild(imageElement);
    miscContainer.appendChild(imageContainer);

    //create numbers block
    let numbersContainer = document.createElement("div");
    numbersContainer.classList.add("numbersContainer");
    numbersContainer.setAttribute("itemId",itemId);
    miscContainer.appendChild(numbersContainer);

    //create price block
    let priceContainer = document.createElement("div");
    priceContainer.classList.add("priceContainer");
    priceContainer.setAttribute("itemId",itemId);
    priceContainer.setAttribute("priceValue",item.price);
    numbersContainer.appendChild(priceContainer);
    
    //attach spam with currency symbol
    let currencySymbolElement = document.createElement("span");
    currencySymbolElement.classList.add("currencySymbol");
    currencySymbolElement.setAttribute("itemId",itemId);
    let currencySymbol = document.createTextNode(currencyInformation.currencySymbol + "$ ");
    currencySymbolElement.appendChild(currencySymbol);
    
    //attach spam with price symbol
    let currencyPriceElement = document.createElement("span");
    currencyPriceElement.className = "currencyPrice";
    currencyPriceElement.setAttribute("itemId",itemId);
    currencyPriceElement.setAttribute("price",item.price);
    let currencyPrice = document.createTextNode((item.price * parseFloat(+currencyInformation.currencyRate)).toFixed(2));
    currencyPriceElement.appendChild(currencyPrice);

    priceContainer.appendChild(currencySymbolElement);
    priceContainer.appendChild(currencyPriceElement);

    //create quantity block
    let qtyInCart = cart.items.findPerId(itemId)!==undefined ? cart.items.findPerId(itemId).qty : 0;
    let qtyMaxPerCustomer = store.items.findPerId(itemId).maxPerCustomer;
    let qtyOnHand = store.items.findPerId(itemId).qtyOnHand;
    let qtyToCart = 0;
    let quantityContainer = document.createElement("div");
    quantityContainer.className = "quantityContainer";
    quantityContainer.setAttribute("itemId",itemId);
    quantityContainer.setAttribute("qtyToCart",qtyToCart);
    quantityContainer.setAttribute("qtyOnHand",qtyOnHand);
    quantityContainer.setAttribute("qtyMaxPerCustomer",qtyMaxPerCustomer);
    quantityContainer.setAttribute("qtyInCart",qtyInCart);
    numbersContainer.appendChild(quantityContainer);
    //row to show the quantity
    let quantityContainerInformation = document.createElement("div");
    quantityContainerInformation.className = "quantityContainerInformation";
    quantityContainerInformation.textContent = qtyToCart;
    quantityContainerInformation.setAttribute("itemId",itemId);
    quantityContainerInformation.setAttribute("qtyToCart",qtyToCart);
    quantityContainerInformation.setAttribute("qtyOnHand",qtyOnHand);
    quantityContainerInformation.setAttribute("qtyMaxPerCustomer",qtyMaxPerCustomer);
    quantityContainerInformation.setAttribute("qtyInCart",qtyInCart);
    quantityContainer.appendChild(quantityContainerInformation);
    //row to contain add and subtract items
    let quantityContainerAddSubtractContainer = document.createElement("div");
    quantityContainerAddSubtractContainer.className = "quantityContainerAddSubtractContainer";
    quantityContainer.appendChild(quantityContainerAddSubtractContainer);
    let quantityContainerAdd = document.createElement("div");
    quantityContainerAdd.className = "quantityContainerAdd";
    quantityContainerAdd.textContent = "+";
    quantityContainerAdd.setAttribute("itemId",itemId);
    quantityContainerAdd.setAttribute("qty",item.qty);
    quantityContainerAddSubtractContainer.appendChild(quantityContainerAdd);
    let quantityContainerSubtract = document.createElement("div");
    quantityContainerSubtract.className = "quantityContainerSubtract";
    quantityContainerSubtract.textContent = "-";
    quantityContainerSubtract.setAttribute("itemId",itemId);
    quantityContainerSubtract.setAttribute("qty",item.qty);
    quantityContainerAddSubtractContainer.appendChild(quantityContainerSubtract);
    //add to cart button
    let quantityContainerAddToCart = document.createElement("div");
    quantityContainerAddToCart.className = "quantityContainerAddToCart";
    quantityContainerAddToCart.textContent = "add to cart";
    quantityContainerAddToCart.setAttribute("itemId",itemId);
    quantityContainerAddToCart.setAttribute("qtyInCart",qtyInCart);
    quantityContainerAddToCart.setAttribute("qtyMaxPerCustomer",qtyMaxPerCustomer);
    quantityContainerAddToCart.setAttribute("qtyOnHand",qtyOnHand);
    quantityContainerAddToCart.setAttribute("qtyToCart",qtyToCart);
    
    quantityContainer.appendChild(quantityContainerAddToCart);
    //qty already got of maximum
    let quantityGotOfMaximum = document.createElement("div");
    quantityGotOfMaximum.classList.add("quantityGotOfMaximum");
    quantityGotOfMaximum.setAttribute("itemId",itemId);
    quantityContainer.appendChild(quantityGotOfMaximum);
    let quantityGot = document.createElement("span");
    quantityGot.classList.add("quantityGot");
    quantityGot.setAttribute("itemId",itemId);
    quantityGot.setAttribute("qtyInCart",qtyInCart);
    quantityGot.textContent = qtyInCart;
    quantityGotOfMaximum.appendChild(quantityGot);
    quantityGotOfMaximum.appendChild(document.createTextNode(" of "));
    let quantityMax = document.createElement("span");
    quantityMax.classList.add("quantityMax");
    quantityMax.setAttribute("itemId",itemId);
    quantityMax.setAttribute("qtyMax",qtyMaxPerCustomer);
    quantityMax.textContent = qtyMaxPerCustomer;
    quantityGotOfMaximum.appendChild(quantityMax);
    quantityGotOfMaximum.appendChild(document.createTextNode("(max)"));    

    //create reviews container
    let reviewsContainer = document.createElement("div");
    let reviews = item.reviews;
    reviewsContainer.className = "reviewsContainer";
    reviewsContainer.setAttribute("itemId",itemId);
    container.appendChild(reviewsContainer);
    let reviewsContainerHeader = document.createElement("div");
    reviewsContainerHeader.className = "header";
    reviewsContainerHeader.setAttribute("itemId",itemId);
    reviewsContainerHeader.textContent = "Reviews";
    reviewsContainer.appendChild(reviewsContainerHeader);
    reviews.forEach((element,index)=>{
        //container for the item
        let reviewItem = document.createElement("div");
        reviewItem.className = "item";
        reviewItem.setAttribute("itemId",itemId);
        reviewItem.setAttribute("index",index);
        reviewsContainer.appendChild(reviewItem);
        //title
        let reviewItemTitle = document.createElement("div");
        reviewItemTitle.className = "title";
        reviewItemTitle.setAttribute("itemId",itemId);
        reviewItemTitle.setAttribute("index",index);
        reviewItemTitle.textContent = element.commentTitle;
        reviewItem.appendChild(reviewItemTitle);
        //container author + date
        let reviewItemAuthorDate = document.createElement("div");
        reviewItemAuthorDate.className = "authorDateContainer";
        reviewItemAuthorDate.setAttribute("itemId",itemId);
        reviewItemAuthorDate.setAttribute("index",index);
        reviewItem.appendChild(reviewItemAuthorDate);
        //author
        let reviewItemAuthor = document.createElement("div");
        reviewItemAuthor.className = "author";
        reviewItemAuthor.setAttribute("itemId",itemId);
        reviewItemAuthor.setAttribute("index",index);
        reviewItemAuthor.textContent = "by " +  element.author;
        reviewItemAuthorDate.appendChild(reviewItemAuthor);
        //date
        let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        let reviewDate = new Intl.DateTimeFormat('en-US',options).format(new Date(element.date));
        let reviewItemDate = document.createElement("div");
        reviewItemDate.className = "date";
        reviewItemDate.setAttribute("itemId",itemId);
        reviewItemDate.setAttribute("index",index);
        reviewItemDate.textContent = "on " + reviewDate;
        reviewItemAuthorDate.appendChild(reviewItemDate);
        //content
        let reviewItemContent = document.createElement("div");
        reviewItemContent.className = "content";
        reviewItemContent.setAttribute("itemId",itemId);
        reviewItemContent.setAttribute("index",index);
        reviewItemContent.textContent = element.comment;
        reviewItem.appendChild(reviewItemContent);
    });

    //container to add a new review
    let newReviewContainer = document.createElement("div");
    newReviewContainer.className = "newReviewContainer";
    newReviewContainer.setAttribute("itemId",itemId);
    reviewsContainer.appendChild(newReviewContainer);
    //button
    let newReviewButton = document.createElement("div");
    newReviewButton.className = "newReviewButton";
    newReviewButton.setAttribute("itemId",itemId);
    newReviewButton.textContent = "create new review";
    newReviewContainer.appendChild(newReviewButton);
    //form
    let newReviewForm = document.createElement("form");
    newReviewForm.className = "newReviewForm";
    newReviewForm.setAttribute("itemId",itemId);
    newReviewContainer.appendChild(newReviewForm);
    //author
    let inputAuthorContainer = document.createElement("fieldset");
    inputAuthorContainer.className = "inputContainer author";
    inputAuthorContainer.setAttribute("itemId",itemId);
    newReviewForm.appendChild(inputAuthorContainer);
    let inputAuthorContainerLegend = document.createElement("legend");
    inputAuthorContainerLegend.className = "inputContainerLegend author";
    inputAuthorContainerLegend.setAttribute("itemId",itemId);
    inputAuthorContainerLegend.textContent = "type your first and last name";
    inputAuthorContainer.appendChild(inputAuthorContainerLegend);
    let inputAuthor = document.createElement("input");
    inputAuthor.className = "inputField author mandatoryInputEmpty";
    inputAuthor.setAttribute("itemId",itemId);
    inputAuthor.placeholder = "name of the author of review";
    inputAuthor.setAttribute("size","68");
    inputAuthorContainer.appendChild(inputAuthor);
    //title
    let inputTitleContainer = document.createElement("fieldset");
    inputTitleContainer.className = "inputContainer title";
    inputTitleContainer.setAttribute("itemId",itemId);
    newReviewForm.appendChild(inputTitleContainer);
    let inputTitleContainerLegend = document.createElement("legend");
    inputTitleContainerLegend.className = "inputContainerLegend title";
    inputTitleContainerLegend.setAttribute("itemId",itemId);
    inputTitleContainerLegend.textContent = "type your review title";
    inputTitleContainer.appendChild(inputTitleContainerLegend);
    let inputTitle = document.createElement("input");
    inputTitle.className = "inputField title mandatoryInputEmpty";
    inputTitle.setAttribute("itemId",itemId);
    inputTitle.placeholder = "name of the author of review";
    inputTitle.setAttribute("size","68");
    inputTitleContainer.appendChild(inputTitle);
    //review
    let inputReviewContainer = document.createElement("fieldset");
    inputReviewContainer.className = "inputContainer review";
    inputReviewContainer.setAttribute("itemId",itemId);
    inputReviewContainer.legend = "write a review";
    newReviewForm.appendChild(inputReviewContainer);
    let inputReviewContainerLegend = document.createElement("legend");
    inputReviewContainerLegend.className = "inputContainerLegend review";
    inputReviewContainerLegend.setAttribute("itemId",itemId);
    inputReviewContainerLegend.textContent = "type your review";
    inputReviewContainer.appendChild(inputReviewContainerLegend);
    let inputReview = document.createElement("textarea");
    inputReview.className = "textAreaField review mandatoryInputEmpty";
    inputReview.setAttribute("itemId",itemId);
    inputReview.textContent = "";
    inputReview.setAttribute("cols","68");
    inputReview.setAttribute("rows","5");
    inputReviewContainer.appendChild(inputReview);
    //submit button
    let newReviewSubmitButton = document.createElement("div");
    newReviewSubmitButton.classList.add("reviewSubmitButton");
    newReviewSubmitButton.setAttribute("itemId",itemId);
    newReviewSubmitButton.value = "submit";
    newReviewSubmitButton.textContent = "submit review";
    newReviewSubmitButton.setAttribute("originalText","submit review");
    newReviewForm.appendChild(newReviewSubmitButton);

    //bind button to view review form
    newReviewButton.addEventListener("click",toggleNewReviewForm,false);

    //bind button to submit review
    newReviewSubmitButton.addEventListener("click",submitNewReview,false);

    //bind author field to check if is blank
    inputAuthor.addEventListener("change",handleChangeAuthorInput,false);
    inputAuthor.addEventListener("keyup",handleChangeAuthorInput,false);
    inputAuthor.addEventListener("blur",handleChangeAuthorInput,false);

    //bind title field to check if is blank
    inputTitle.addEventListener("change",handleChangeTitleInput,false);
    inputTitle.addEventListener("keyup",handleChangeTitleInput,false);
    inputTitle.addEventListener("blur",handleChangeTitleInput,false);

    //bind review field to check if is blank
    inputReview.addEventListener("change",handleChangeReviewInput,false);
    inputReview.addEventListener("keyup",handleChangeReviewInput,false);
    inputReview.addEventListener("blur",handleChangeReviewInput,false);

    //bind add quantity to go to cart
    quantityContainerAdd.addEventListener("click",handleIncrementQuantityToGoToCartFromDetails,false);

    //bind subtract quantity to go to cart
    quantityContainerSubtract.addEventListener("click",handleDecrementQuantityToGoToCartFromDetails,false);

    //bind add to cart
    quantityContainerAddToCart.addEventListener("click",handleAddToCartFromDetails,false);


}//end of showElementDetails

const showMoreContents = ()=>{
    let itemId = event.target.getAttribute("itemId");
    let descriptionContainerContents = document.querySelector(`section#detailsSection .container .descriptionContainer .descriptionContainerContents[itemId='${itemId}']`);
    let descriptionContainerLess = document.querySelector(`section#detailsSection .container .descriptionContainer .less[itemId='${itemId}']`);
    let descriptionContainerMore = document.querySelector(`section#detailsSection .container .descriptionContainer .more[itemId='${itemId}']`);
    descriptionContainerContents.textContent = descriptionContainerContents.getAttribute("contents");
    descriptionContainerLess.style.display="block";
    descriptionContainerMore.style.display="none";
}

const showLessContents = ()=>{
    let itemId = event.target.getAttribute("itemId");
    let descriptionContainerContents = document.querySelector(`section#detailsSection .container .descriptionContainer .descriptionContainerContents[itemId='${itemId}']`);
    let descriptionContainerLess = document.querySelector(`section#detailsSection .container .descriptionContainer .less[itemId='${itemId}']`);
    let descriptionContainerMore = document.querySelector(`section#detailsSection .container .descriptionContainer .more[itemId='${itemId}']`);
    descriptionContainerContents.textContent = descriptionContainerContents.getAttribute("contents").substr(0,100);
    descriptionContainerLess.style.display="none";
    descriptionContainerMore.style.display="block";
}//end of showLessContents

const showNewReviewForm = (itemId)=>{
    let newReviewForm = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm`);
    newReviewForm.style.display = "flex";
}//end of showNewReviewForm

const hideNewReviewForm = (itemId)=>{
    let newReviewForm = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm`);
    newReviewForm.style.display = "none";
}//end of hideNewReviewForm

const toggleNewReviewForm = ()=>{
    let itemId = event.target.getAttribute("itemId");
    let newReviewForm = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm`);
    if(newReviewForm.style.display=="none"){
        showNewReviewForm(itemId);
    } else {
        hideNewReviewForm(itemId);
    }
}//end of hideNewReviewForm

const submitNewReview = ()=>{
    //TODO: make the button change class someway
    event.preventDefault();
    let itemId = event.target.getAttribute("itemId");
    let authorField = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm fieldset.author input`);
    let author = authorField.value;
    let titleField = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm fieldset.title input`);
    let title = titleField.value;
    let reviewField = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm fieldset.review textarea`);
    let review = reviewField.value;
    let submitButton = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm .reviewSubmitButton`);
    if(author.replace(/\s+/gi,"") == "" || review.replace(/\s+/gi,"") == ""){
        submitButton.textContent = "neither author nor review can be blank!";
        submitButton.classList.add("submitButtonBlankError");
        submitButton.setAttribute("disabled","disabled");
        window.setTimeout(()=>{
            submitButton.classList.remove("submitButtonBlankError");
            submitButton.removeAttribute("disabled");
            submitButton.textContent = submitButton.getAttribute("originalText");
        },900);
        return;
    }
    console.log("author entered:",author);
    console.log("review entered:",review);
    let justNow = new Date();
    let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let reviewDate = new Intl.DateTimeFormat('en-US',options).format(justNow);
    let reviewId = Symbol();
    //insert review at the product
    let product = store.items.findPerId(itemId);
    let reviews = product.reviews;
    reviews.push({
        
            id: reviewId,
            author: author,
            stars: 5,
            date: justNow,
            commentTitle: title,
            comment: review

    });//end of reviews.push
    //update the reviews at the page
    //container for the item
    let nextIndex = document.querySelectorAll(`.reviewsContainer[itemId='${itemId}'] .item`).length;
    let reviewsContainer = document.querySelector(`.reviewsContainer[itemId='${itemId}']`);
    let reviewItem = document.createElement("div");
    reviewItem.className = "item";
    reviewItem.setAttribute("itemId",itemId);
    reviewItem.setAttribute("index",nextIndex);
    reviewsContainer.appendChild(reviewItem);
    //title
    let reviewItemTitle = document.createElement("div");
    reviewItemTitle.className = "title";
    reviewItemTitle.setAttribute("itemId",itemId);
    reviewItemTitle.setAttribute("index",nextIndex);
    reviewItemTitle.textContent = title;
    reviewItem.appendChild(reviewItemTitle);
    //container author + date
    let reviewItemAuthorDate = document.createElement("div");
    reviewItemAuthorDate.className = "authorDateContainer";
    reviewItemAuthorDate.setAttribute("itemId",itemId);
    reviewItemAuthorDate.setAttribute("index",nextIndex);
    reviewItem.appendChild(reviewItemAuthorDate);
    //author
    let reviewItemAuthor = document.createElement("div");
    reviewItemAuthor.className = "author";
    reviewItemAuthor.setAttribute("itemId",itemId);
    reviewItemAuthor.setAttribute("index",nextIndex);
    reviewItemAuthor.textContent = "by " +  author;
    reviewItemAuthorDate.appendChild(reviewItemAuthor);
    //date
    let reviewItemDate = document.createElement("div");
    reviewItemDate.className = "date";
    reviewItemDate.setAttribute("itemId",itemId);
    reviewItemDate.setAttribute("index",nextIndex);
    reviewItemDate.textContent = "on " + reviewDate;
    reviewItemAuthorDate.appendChild(reviewItemDate);
    //content
    let reviewItemContent = document.createElement("div");
    reviewItemContent.className = "content";
    reviewItemContent.setAttribute("itemId",itemId);
    reviewItemContent.setAttribute("index",nextIndex);
    reviewItemContent.textContent = review;
    reviewItem.appendChild(reviewItemContent);
    //erase fields
    authorField.value = "";
    authorField.classList.add("mandatoryInputEmpty");
    titleField.value = "";
    titleField.classList.add("mandatoryInputEmpty");
    reviewField.value = "";
    reviewField.classList.add("mandatoryInputEmpty");

}

const handleChangeAuthorInput = ()=>{
    let itemId = event.target.getAttribute("itemId");
    let authorField = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm fieldset.author input`);
    if(authorField.value.replace(/\s+/gi,"")==""){
        authorField.classList.add("mandatoryInputEmpty");
    } else {
        authorField.classList.remove("mandatoryInputEmpty");
    }
}//end of handleChangeAuthorInput

const handleChangeTitleInput = ()=>{
    let itemId = event.target.getAttribute("itemId");
    let titleField = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm fieldset.title input`);
    if(titleField.value.replace(/\s+/gi,"")==""){
        titleField.classList.add("mandatoryInputEmpty");
    } else {
        titleField.classList.remove("mandatoryInputEmpty");
    }
}//end of handleChangeTitleInput

const handleChangeReviewInput = ()=>{
    let itemId = event.target.getAttribute("itemId");
    let reviewField = document.querySelector(`section#detailsSection .container[itemId='${itemId}'] .reviewsContainer .newReviewContainer .newReviewForm fieldset.review textarea`);
    if(reviewField.value.replace(/\s+/gi,"")==""){
        reviewField.classList.add("mandatoryInputEmpty");
    } else {
        reviewField.classList.remove("mandatoryInputEmpty");
    }
}//end of handleChangeReviewInput

//TODO: functions

//bind add quantity to go to cart
const handleIncrementQuantityToGoToCartFromDetails = ()=>{
    const itemId = event.target.getAttribute("itemId");
    const storeElement = store.items.findPerId(itemId);
    const qtyToCartElement = document.querySelector(`section#detailsSection .container .miscContainer .numbersContainer .quantityContainer .quantityContainerInformation[itemId='${itemId}']`);
    const qtyIncrementToCart = document.querySelector(`section#detailsSection .quantityContainer quantityContainerAddSubtractContainer .quantityContainerAdd[itemId='${itemId}']`);
    const qtyDecrementFromCart = document.querySelector(`section#detailsSection .quantityContainer .quantityContainerAddSubtractContainer .quantityContainerSubtract[itemId='${itemId}']`);
    const qtyAddToCart = document.querySelector(`section#detailsSection .quantityContainer .quantityContainerAddToCart[itemId='${itemId}']`);
    const qtyFromMaximum = document.querySelector(`section#detailsSection .quantityContainer .quantityGotOfMaximum .quantityGot[itemId='${itemId}']`);

    const qtyInCart = cart.items.findPerId(itemId) !== undefined ? parseInt(+cart.items.findPerId(itemId).qty) : 0;
    const qtyMaxPerCustomer = parseInt(+store.items.findPerId(itemId).maxPerCustomer);
    const qtyOnHand = parseInt(+store.items.findPerId(itemId).qtyOnHand);
    let qtyToCart = parseInt(+qtyToCartElement.getAttribute("qtytocart"));
    
    if((qtyToCart+1+qtyInCart)<=qtyMaxPerCustomer && (qtyToCart+1+qtyInCart)<=qtyOnHand){
        qtyToCart ++ ;
        qtyToCartElement.textContent = qtyToCart;
        qtyToCartElement.setAttribute("qtytocart",qtyToCart);
        qtyAddToCart.setAttribute("qtyToCart",qtyToCart);
        //sum qty of maximum
        qtyFromMaximum.setAttribute("qtyincart",+qtyToCart + +qtyInCart);
        qtyFromMaximum.textContent = +qtyToCart + +qtyInCart;
    } else {
        if( (qtyToCart+1+qtyInCart)>qtyMaxPerCustomer ){
            alertMessageToUser(`You cannot place more items than the maximum of ${qtyMaxPerCustomer} allowable per customer!`);
        }
        if( (qtyToCart+1+qtyInCart)>qtyOnHand ){
            alertMessageToUser(`You cannot place more items than the maximum of ${qtyOnHand} available in stock!`);
        }
    }

};

//bind subtract quantity to go to cart
const handleDecrementQuantityToGoToCartFromDetails = ()=>{
    const itemId = event.target.getAttribute("itemId");
    const storeElement = store.items.findPerId(itemId);
    const qtyToCartElement = document.querySelector(`section#detailsSection .container .miscContainer .numbersContainer .quantityContainer .quantityContainerInformation[itemId='${itemId}']`);
    const qtyIncrementToCart = document.querySelector(`section#detailsSection .quantityContainer quantityContainerAddSubtractContainer .quantityContainerAdd[itemId='${itemId}']`);
    const qtyDecrementFromCart = document.querySelector(`section#detailsSection .quantityContainer .quantityContainerAddSubtractContainer .quantityContainerSubtract[itemId='${itemId}']`);
    const qtyAddToCart = document.querySelector(`section#detailsSection .quantityContainer .quantityContainerAddToCart[itemId='${itemId}']`);
    const qtyFromMaximum = document.querySelector(`section#detailsSection .quantityContainer .quantityGotOfMaximum .quantityGot[itemId='${itemId}']`);

    const qtyInCart = cart.items.findPerId(itemId) !== undefined ? parseInt(+cart.items.findPerId(itemId).qty) : 0;
    const qtyMaxPerCustomer = parseInt(+store.items.findPerId(itemId).maxPerCustomer);
    const qtyOnHand = parseInt(+store.items.findPerId(itemId).qtyOnHand);
    let qtyToCart = parseInt(+qtyToCartElement.getAttribute("qtytocart"));
    
    if((qtyToCart-1)>=0){
        qtyToCart -- ;
        qtyToCartElement.textContent = qtyToCart;
        qtyToCartElement.setAttribute("qtytocart",qtyToCart);
        qtyAddToCart.setAttribute("qtyToCart",qtyToCart);
        //sum qty of maximum
        qtyFromMaximum.setAttribute("qtyincart",+qtyToCart + +qtyInCart);
        qtyFromMaximum.textContent = +qtyToCart + +qtyInCart;
    } 
};

//bind add to cart
const handleAddToCartFromDetails = ()=>{
    const itemId = event.target.getAttribute("itemId");
    const storeElement = store.items.findPerId(itemId);
    const qtyToCartElement = document.querySelector(`section#detailsSection .container .miscContainer .numbersContainer .quantityContainer .quantityContainerInformation[itemId='${itemId}']`);
    if(parseInt(+qtyToCartElement.getAttribute("qtyToCart"))===0) return;
    const qtyIncrementToCart = document.querySelector(`section#detailsSection .quantityContainer quantityContainerAddSubtractContainer .quantityContainerAdd[itemId='${itemId}']`);
    const qtyDecrementFromCart = document.querySelector(`section#detailsSection .quantityContainer .quantityContainerAddSubtractContainer .quantityContainerSubtract[itemId='${itemId}']`);
    const qtyAddToCart = document.querySelector(`section#detailsSection .quantityContainer .quantityContainerAddToCart[itemId='${itemId}']`);
    const qtyFromMaximum = document.querySelector(`section#detailsSection .quantityContainer .quantityGotOfMaximum .quantityGot[itemId='${itemId}']`);

    const qtyInCart = cart.items.findPerId(itemId) !== undefined ? parseInt(+cart.items.findPerId(itemId).qty) : 0;
    const qtyMaxPerCustomer = parseInt(+storeElement.maxPerCustomer);
    const qtyOnHand = parseInt(+storeElement.qtyOnHand);
    const qtyToCart = parseInt(+qtyToCartElement.getAttribute("qtytocart"));
    
    //create new item to add to cart
    let newItemToCart = new CartItem(
        itemId,
        storeElement.price,
        +qtyToCart,
        +storeElement.costOfShipping
    );
    cart.addItem(newItemToCart);
    qtyToCartElement.setAttribute("qtytocart",0);
    qtyToCartElement.textContent = 0;
    qtyAddToCart.setAttribute("qtytocart",0);
    store.items.findPerId(itemId).qtyOnHand -= qtyToCart;
    updateCart();
    updateCartBadge()
    displayStoreItems();
};
