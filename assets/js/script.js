var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city-name");
var currentSearchEl = document.querySelector("#current-search");
var forecastContainerEl = document.querySelector("#forecast-container");
var searchHistoryContainerEl = document.querySelector("#search-history-container");

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
function historyButtonHandler(event){
    var city = event.target.textContent;
    var currentSearchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    callCurrentAPI(currentSearchURL);

}
function callCurrentAPI(currentSearchURL){
    fetch(currentSearchURL).then(function(response){
        if (response.ok){
            cityInputEl.value = "";
            response.json().then(function(data){
                console.log(data);
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                callUVIndexAPI(data, lat, lon);
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
function callUVIndexAPI(mainData, lat, lon){
    //UV index can't be called with just city name, needs latitude and longitude
    var UVIndexURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&appid=" + APIkey + "&units=imperial";
    fetch(UVIndexURL).then(function(response){
        if (response.ok){
            cityInputEl.value = "";
            response.json().then(function(data){
                // console.log("UV index");
                // console.log(data);
                // console.log(data.daily[0].uvi);
                var UVI = data.daily[0].uvi;
                displayCurrentWeather(mainData, UVI);
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
function clearCurrentDisplay(){

    if(currentSearchEl){
        while(currentSearchEl.hasChildNodes()){
            var childEl = currentSearchEl.firstChild;
            currentSearchEl.removeChild(childEl);     
        }
    }
    while(forecastContainerEl.hasChildNodes()){
        var forecastChild = forecastContainerEl.firstChild;
        forecastContainerEl.removeChild(forecastChild);
    }
}
function clearHistoryDisplay(){
    if(searchHistoryContainerEl){
        while(searchHistoryContainerEl.hasChildNodes()){
            var childEl = searchHistoryContainerEl.firstChild;
            searchHistoryContainerEl.removeChild(childEl);     
        }
    }
}

function displayCurrentWeather(data, UVI){
    clearCurrentDisplay();
    var currentContainerEl = document.createElement("div");
    currentContainerEl.classList = "border border-dark p-1 row";

    var cityNameEl = document.createElement("h3");
    cityNameEl.textContent = data.name + " (" + dateString + ")";
    cityNameEl.classList = "col-12 font-weight-bold"
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png")
    weatherIcon.setAttribute("alt", data.weather.description);
    weatherIcon.setAttribute("style", "width: 50px; height: 50px;");
    cityNameEl.appendChild(weatherIcon);
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

    var UVIndexEl = document.createElement("span");
    UVIndexEl.textContent = "UV Index: ";
    UVIndexEl.classList = "col-12"
    var UVIndicatorEl = document.createElement("span");
    UVIndicatorEl.textContent = UVI;
    UVIndicatorEl.classList = "rounded px-3";
    // console.log(parseInt(UVI));
    if(parseFloat(UVI) >= 8){
        UVIndicatorEl.classList.add("bg-danger");
        UVIndicatorEl.classList.add("text-light");
    }
    else if (parseFloat(UVI) >= 4){
        UVIndicatorEl.classList.add("bg-warning");
        UVIndicatorEl.classList.add("text-dark");
    }
    else{
        UVIndicatorEl.classList.add("bg-success");
        UVIndicatorEl.classList.add("text-light");
    }
    UVIndexEl.appendChild(UVIndicatorEl);
    currentContainerEl.appendChild(UVIndexEl);
    

    currentSearchEl.appendChild(currentContainerEl);
    createHistoryButtons();
    addToHistory(data.name);
}
function displayFiveDayForecast(){

}

function addToHistory(city){
    var history = JSON.parse(localStorage.getItem("searchHistory"));
    if(history){
        //remove duplicates
        for(var i =0; i < history.length; i++){
            if(history[i] === city){
                history.splice(i,1);
            }
        }
        history.unshift(city);
    }
    else{
        history = [];
        history.unshift(city);
    }

    localStorage.setItem("searchHistory", JSON.stringify(history));

}
function createHistoryButtons(){
    clearHistoryDisplay();
    var history = JSON.parse(localStorage.getItem("searchHistory"));

    if(history){

        for(var i = 0; i < history.length; i++){
            let cityHistoryEl = document.createElement("button");
            cityHistoryEl.textContent = history[i];
            cityHistoryEl.classList = "p-1 m-1 col-12 w-100 text-light bg-dark rounded"
            searchHistoryContainerEl.appendChild(cityHistoryEl)
        }
    }
}

userFormEl.addEventListener("submit", searchBtnHandler);
searchHistoryContainerEl.addEventListener("click", historyButtonHandler);