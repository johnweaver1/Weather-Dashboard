// variable for storing my city!
var search="";
// The classic global variables!
var searchbar = $("#city");
var searchButton = $("#city-button");
var currentTemp = $("#temp");
var clearButton = $("#clear-history");
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
        //Create tempature
        $(currentTemp).html(response.main.temp);
        $(currentHumidity).html(response.main.humidity);
        $(currentWSpeed).html(response.wind.speed);
    })
}
$("#city-button").on("click",weatherStuff);