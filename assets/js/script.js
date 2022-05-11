var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city-name");

const APIkey = "2dcaaab2dfc382fe583d27ce65d5cc26"

function searchBtnHandler(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    var searchString = "https://api.openweathermap.org/data/2.5/weather?" + city + "&appid=" + APIkey;

    if(city){
        callAPI(searchString);
    }
    else{
        alert("Please enter the name of a city");
    }
}
function callAPI(searchString){

}

userFormEl.addEventListener("submit", searchBtnHandler);