const turnOnGreyArea = function (){
    let greyAreaElement = document.getElementById("greyArea");
    greyAreaElement.setAttribute("style","display:block;min-height:"+document.body.clientHeight+"px");
    greyArea.isVisible = true;
}

const turnOffGreyArea = function (){
    let greyAreaElement = document.getElementById("greyArea");
    greyAreaElement.setAttribute("style","display:none");
    greyArea.isVisible = false;
}