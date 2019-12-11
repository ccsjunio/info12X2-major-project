const showSourcesSection = ()=>{
    console.log("showing element sources");
    sourcesSection.show();
    sourcesSection.targetElement.innerHTML = "";
    sourcesSection.targetElement.textContent = "";

    let sourcesHeader = document.createElement("div");
    sourcesSection.targetElement.appendChild(sourcesHeader);
    sourcesHeader.classList.add("sectionHeader");
    sourcesHeader.innerHTML = "Sources of Material";

    let sourcesContainer = document.createElement("div");
    sourcesSection.targetElement.appendChild(sourcesContainer);
    sourcesContainer.classList.add("sourcesContainer");

    //append sources from catalog
    store.items.forEach((element)=>{
        let sourceItem = document.createElement("div");
        sourcesContainer.appendChild(sourceItem);
        sourceItem.classList.add("sourceItem");

        let sourceImage = document.createElement("div");
        sourceItem.appendChild(sourceImage);
        sourceImage.classList.add("sourceImage");
        
        let img = document.createElement("img");
        sourceImage.appendChild(img);
        img.src = URL_PUBLIC + "/images/" + element.image;

        let originalSource = document.createElement("div");
        sourceItem.appendChild(originalSource);
        originalSource.classList.add("originalSource");
        originalSource.innerHTML = "source:<br/>" + "<a target='_blank' href='" + element.originalSource + "'>" + element.originalSource + "</a>";

    });

    //append emptyBox
    let sourceItemEmptyBox = document.createElement("div");
    sourcesContainer.appendChild(sourceItemEmptyBox);
    sourceItemEmptyBox.classList.add("sourceItem");

    let sourceImageEmptyBox = document.createElement("div");
    sourceItemEmptyBox.appendChild(sourceImageEmptyBox);
    sourceImageEmptyBox.classList.add("sourceImage");
    
    let imgEmptyBox = document.createElement("img");
    sourceImageEmptyBox.appendChild(imgEmptyBox);
    imgEmptyBox.src = "https://media1.tenor.com/images/abc924c38da265f9049f09be4f48b1e1/tenor.gif?itemid=13093113";

    let originalSourceEmptyBox = document.createElement("div");
    sourceItemEmptyBox.appendChild(originalSourceEmptyBox);
    originalSourceEmptyBox.classList.add("originalSource");
    originalSourceEmptyBox.innerHTML = "source:<br/>" + "<a target='_blank' href='" + imgEmptyBox.src + "'>" + imgEmptyBox.src + "</a>";

    //append logo
    let sourceItemLogo = document.createElement("div");
    sourcesContainer.appendChild(sourceItemLogo);
    sourceItemLogo.classList.add("sourceItem");

    let sourceImageLogo = document.createElement("div");
    sourceItemLogo.appendChild(sourceImageLogo);
    sourceImageLogo.classList.add("sourceImage");
    
    let imgLogo = document.createElement("img");
    sourceImageLogo.appendChild(imgLogo);
    imgLogo.src = URL_ASSETS + "/logo/" + "logoGobi.png";

    let originalSourceLogo = document.createElement("div");
    sourceItemLogo.appendChild(originalSourceLogo);
    originalSourceLogo.classList.add("originalSource");
    originalSourceLogo.innerHTML = "source:<br/>" + "Made by Carlos Cesar Ferraz (me)";

    //menu
    let sourceItemMenu = document.createElement("div");
    sourcesContainer.appendChild(sourceItemMenu);
    sourceItemMenu.classList.add("sourceItem");

    let sourceImageMenu = document.createElement("div");
    sourceItemMenu.appendChild(sourceImageMenu);
    sourceImageMenu.classList.add("sourceImage");
    
    let imgMenu = document.createElement("img");
    sourceImageMenu.appendChild(imgMenu);
    imgMenu.src = URL_PUBLIC + "/icons/" + "menu-24px.svg";

    let originalSourceMenu = document.createElement("div");
    sourceItemMenu.appendChild(originalSourceMenu);
    originalSourceMenu.classList.add("originalSource");
    originalSourceMenu.innerHTML = "source:<br/>" + "<a target='_blank' href='https://material.io/resources/icons/?style=outline'>https://material.io/resources/icons/?style=outline</a>";

    //shopping cart
    let sourceItemShoppingCart = document.createElement("div");
    sourcesContainer.appendChild(sourceItemShoppingCart);
    sourceItemShoppingCart.classList.add("sourceItem");

    let sourceImageShoppingCart = document.createElement("div");
    sourceItemShoppingCart.appendChild(sourceImageShoppingCart);
    sourceImageShoppingCart.classList.add("sourceImage");
    
    let imgShoppingCart = document.createElement("img");
    sourceImageShoppingCart.appendChild(imgShoppingCart);
    imgShoppingCart.src = URL_PUBLIC + "/icons/" + "shopping_cart-24px.svg";

    let originalSourceShoppingCart = document.createElement("div");
    sourceItemShoppingCart.appendChild(originalSourceShoppingCart);
    originalSourceShoppingCart.classList.add("originalSource");
    originalSourceShoppingCart.innerHTML = "source:<br/>" + "<a target='_blank' href='https://material.io/resources/icons/?icon=shopping_cart&style=outline'>https://material.io/resources/icons/?icon=shopping_cart&style=outline</a>";

    //Warning2
    let sourceItemWarning2 = document.createElement("div");
    sourcesContainer.appendChild(sourceItemWarning2);
    sourceItemWarning2.classList.add("sourceItem");

    let sourceImageWarning2 = document.createElement("div");
    sourceItemWarning2.appendChild(sourceImageWarning2);
    sourceImageWarning2.classList.add("sourceImage");
    
    let imgWarning2 = document.createElement("img");
    sourceImageWarning2.appendChild(imgWarning2);
    imgWarning2.src = URL_PUBLIC + "/images/" + "warning-2.gif";

    let originalSourceWarning2 = document.createElement("div");
    sourceItemWarning2.appendChild(originalSourceWarning2);
    originalSourceWarning2.classList.add("originalSource");
    originalSourceWarning2.innerHTML = "source:<br/>" + "<a target='_blank' href='https://icons8.com/animated-icons/warning-2'>https://icons8.com/animated-icons/warning-2</a>";

    //warning1
    let sourceItemWarning1 = document.createElement("div");
    sourcesContainer.appendChild(sourceItemWarning1);
    sourceItemWarning1.classList.add("sourceItem");

    let sourceImageWarning1 = document.createElement("div");
    sourceItemWarning1.appendChild(sourceImageWarning1);
    sourceImageWarning1.classList.add("sourceImage");
    
    let imgWarning1 = document.createElement("img");
    sourceImageWarning1.appendChild(imgWarning1);
    imgWarning1.src = URL_PUBLIC + "/images/" + "warning-1.gif";

    let originalSourceWarning1 = document.createElement("div");
    sourceItemWarning1.appendChild(originalSourceWarning1);
    originalSourceWarning1.classList.add("originalSource");
    originalSourceWarning1.innerHTML = "source:<br/>" + "<a target='_blank' href='https://icons8.com/animated-icons/warning-1'>https://icons8.com/animated-icons/warning-1</a>";


}