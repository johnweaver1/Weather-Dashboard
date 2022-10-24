// variable for storing my city!
var search="";
// The classic global variables!
var searchbar = $("#city");
var currentTemp = $("#temp");
var currentHumidity= $("#humidity");
var searchedCity = $("#searched-city");
var currentWSpeed=$("#wind");
var API="4705916555faeb31bea56ca102879a50";
var catalogue=[];
// creating a function to search through cities to see if it exists
function find(aCity){
    for (var i=0; i<catalogue.length; i++){
        if(aCity.toUpperCase()===catalogue[i]){
            return -1;
        }
    }
    return 1;
}
//Displays the current and future weather to the user after the city from the search box
function weatherStuff(event){
    event.preventDefault();
    if (searchbar.val().trim()!==""){
        city=searchbar.val().trim();
        informationGrab(city);
    }
}
//creating a function for grabbing our weather data!
function informationGrab(city){
    //Enetering in url for current weather!
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + API;
    $.ajax({
        url:requestUrl,
        method:"GET",
    }).then(function(response){
        console.log(response);
        // Getting the icon from API server
        var icon= response.weather[0].icon;
        var iconURL="https://openweathermap.org/img/wn/"+icon +"@2x.png";
        // creating a date format
        var date=new Date(response.dt*1000).toLocaleDateString();
        //now we bring the stuff togethor!
        $(searchedCity).html(response.name +"("+date+")" + "<img src="+iconURL+">");
        //Create tempature, wind, and humidity
        //HAd to change the tempature to farehheit because it is in Kelvin originally.
        var farenheit= (((response.main.temp-273.5)*1.80)+32).toFixed(0) + "°F";
        $(currentTemp).html(farenheit);
        $(currentHumidity).html(response.main.humidity+"%");
        $(currentWSpeed).html(response.wind.speed);
        //Using the 5 day forecast we put everything in the JSON and allows us to store info!
        forecast(response.id);
        if(response.cod==200){
            catalogue=JSON.parse(localStorage.getItem("cityname"));
            console.log(catalogue);
            if (catalogue==null){
                catalogue=[];
                catalogue.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(catalogue));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    catalogue.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(catalogue));
                    addToList(city);
                }
            }
        }
    })
}
// this creates the 5 day forecast!
function forecast(cityid){
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+API;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var ic= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+ic+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var temp5=(((tempK-273.5)*1.80)+32).toFixed(0);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#fdate"+i).html(date);
            $("#fimg"+i).html("<img src="+iconurl+">");
            $("#ftemp"+i).html(temp5+"°F");
            $("#fhumidity"+i).html(humidity+"%");
        }
        
    });
}
//this adds the city that was just searched to a list below the clear history
function addToList(beepo){
    var previous= $("<li>"+beepo.toUpperCase()+"</li>");
    $(previous).attr("class","list-group-item");
    $(previous).attr("data-value",beepo.toUpperCase());
    $(".list-group").append(previous);
}
// This is so when you click on the item in the list it actually brings the weather data with it!
function pastSearch(event){
    var pSearch=event.target;
    if (event.target.matches("li")){
        city=pSearch.textContent.trim();
        informationGrab(city);
    }

}
// function for recalling the last city.
function lastCity(){
    $("ul").empty();
    var catalogue = JSON.parse(localStorage.getItem("cityname"));
    if(catalogue!==null){
        catalogue=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<catalogue.length;i++){
            addToList(catalogue[i]);
        }
        city=catalogue[i-1];
        informationGrab(city);
    }

}
// Used to clear the history of the page.
function clearHistory(event){
    event.preventDefault();
    catalogue=[];
    localStorage.removeItem("cityname");
    document.location.reload();

}
$("#city-button").on("click",weatherStuff);
$(document).on("click",pastSearch);
$(window).on("load",lastCity);
$("#clear-history").on("click",clearHistory);