var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city-name");
var currentSearchEl = document.querySelector("#current-search");

var dateString = new Date().toDateString();
const APIkey = "2dcaaab2dfc382fe583d27ce65d5cc26"
var UVIndex = "";

function searchBtnHandler(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    var currentSearchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey + "&units=imperial";
    // var UVIndexURL = "https://api.openweathermap.org/data/2.5/onecall?q=" + city + "&appid=" + APIkey + "&units=imperial";
    // var UVIndexURL = "https://api.openweathermap.org/data/2.5/onecall?lat=37.3688&lon=-122.0363&appid=" + APIkey + "&units=imperial";

    if(city){
        callCurrentAPI(currentSearchURL);
        // callUVIndexAPI(UVIndexURL);
    //     callForecastAPI(forecastURL);
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
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                var UVI = callUVIndexAPI(lat, lon);
                displayCurrentWeather(data, UVI);
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
function callUVIndexAPI(lat, lon){
    //UV index can't be called with just city name, needs latitude and longitude
    var UVIndexURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid=" + APIkey + "&units=imperial";
    fetch(UVIndexURL).then(function(response){
        if (response.ok){
            cityInputEl.value = "";
            response.json().then(function(data){
                console.log("UV index");
                console.log(data.daily[0].uvi);
                return data.daily[0].uvi;
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
// function callForecastAPI(forecastURL){
//     fetch(forecastURL).then(function(response){
//         if (response.ok){
//             cityInputEl.value = "";
//             response.json().then(function(data){
//                 console.log("forecast data");
//                 console.log(data);
 
//             });
//         }
//         else{
//             alert("Error: Unable to find data for that city");
//         }
//     })
//     .catch(function(error){
//         console.log(error);
//     });
// }


function displayCurrentWeather(data, UVI){
    var currentContainerEl = document.createElement("div");
    currentContainerEl.classList = "border border-dark p-1 row";

    var cityNameEl = document.createElement("h3");
    cityNameEl.textContent = data.name + " (" + dateString + ")";
    cityNameEl.classList = "col-12"
    currentContainerEl.appendChild(cityNameEl);

    var tempEl = document.createElement("span");
    tempEl.textContent = "Temp: " + data.main.temp +"°F";
    tempEl.classList = "col-12"
    currentContainerEl.appendChild(tempEl);

    var windEl = document.createElement("span");
    windEl.textContent = "Wind: " + data.wind.speed + "MPH";
    windEl.classList = "col-12"
    currentContainerEl.appendChild(windEl);

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + data.main.humidity + "%";
    humidityEl.classList = "col-12"
    currentContainerEl.appendChild(humidityEl);

    

    currentSearchEl.appendChild(currentContainerEl);
}
function displayFiveDayForecast(){

}

userFormEl.addEventListener("submit", searchBtnHandler);