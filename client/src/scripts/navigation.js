if(document.getElementById("nav_btn") &&  document.getElementById("navigation")){
    document.getElementById("nav_btn").addEventListener("click", function(e){
        var btn = document.getElementById("nav_btn");
        var nav = document.getElementById("navigation");
        if(btn.classList.contains("is-active")){
            btn.classList.remove("is-active");
            nav.classList.remove("is-active")
        }else{
            btn.classList.add("is-active");
            nav.classList.add("is-active");
        }
    });
}