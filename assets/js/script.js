var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city-name");
var currentSearchEl = document.querySelector("#current-search");

var dateString = new Date().toDateString();
const APIkey = "2dcaaab2dfc382fe583d27ce65d5cc26"

function searchBtnHandler(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    var currentSearchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    var forecastURL = "api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey + "&units=imperial";
    var UVIndexURL = "https://api.openweathermap.org/data/2.5/onecall?q=" + city + "&appid=" + APIkey + "&units=imperial";

    if(city){
        callCurrentAPI(currentSearchURL);
    }
    else{
        alert("Please enter the name of a city");
    }
}
function callCurrentAPI(currentSearchURL){
    fetch(currentSearchURL).then(function(response){
        if (response.ok){
            cityInputEl.value = "";
            response.json().then(function(data){
                console.log(data);
                console.log(data.name);
                console.log(data.main);
                console.log(dateString);
            });
        }
        else{
            alert("Error: Unable to find data for that city");
        }
    })
    .catch(function(error){
        console.log(error);
    });
}
function callForecastAPI(forecastURL){

}
function callUVIndexAPI(UVIndexURL){

}


function displayCurrentWeather(data){

    // currentSearchEl.appendChild();
}
function displayFiveDayForecast(){

}

userFormEl.addEventListener("submit", searchBtnHandler);