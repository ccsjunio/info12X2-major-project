const DisplayElement = class{
    constructor(targetElement,options){
        this.isVisible = false;
        this.targetElement = targetElement!==undefined ? document.getElementById(targetElement) : null;
        this.category = options.category;
        this.isExclusive = options.exclusive;
        this.useGreyArea = options.greyArea!==undefined ? options.greyArea : false;
    }

    show(){ 
        if(this.targetElement!==null){
            if(this.useGreyArea) this.turnOnGreyArea();
            document.querySelector(`${this.category}[id='${this.targetElement.id}']`).style.display="block";
            if(this.isExclusive){
                document.querySelectorAll(`${this.category}:not([id='${this.targetElement.id}'])`).forEach((element)=>element.style.display="none");
            }
        }
    }
    
    hide(){
        if(this.targetElement!==null){
            document.querySelector(`${this.category}[id='${this.targetElement.id}']`).style.display = "none";
            if(this.useGreyArea) this.turnOffGreyArea();
        }
    }
    
    toggle(){
        if(this.targetElement!==null){
            console.log("targetElement in DisplayElement=",this);
            this.isVisible = !this.isVisible;
            this.isVisible ? (this.show()) : (this.hide());
        }
    }

    turnOnGreyArea(){
        let greyAreaElement = document.getElementById("greyArea");
        greyAreaElement.setAttribute("style","display:block;min-height:"+document.body.clientHeight+"px");
    }
    
    turnOffGreyArea(){
        let greyAreaElement = document.getElementById("greyArea");
        greyAreaElement.setAttribute("style","display:none");
    }
}