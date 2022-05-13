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
        callForecastAPI(forecastURL);
    }
    else{
        alert("Please enter the name of a city");
    }
}
function historyButtonHandler(event){
    var city = event.target.textContent;
    var currentSearchURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey + "&units=imperial";
    callCurrentAPI(currentSearchURL);
    callForecastAPI(forecastURL);

}

//-------------API FUNCTIONS----------------------------
function callCurrentAPI(currentSearchURL){
    fetch(currentSearchURL).then(function(response){
        if (response.ok){
            cityInputEl.value = "";
            response.json().then(function(data){
                // console.log("main data");
                // console.log(data);
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
function callForecastAPI(forecastURL){
    fetch(forecastURL).then(function(response){
        if (response.ok){
            cityInputEl.value = "";
            response.json().then(function(data){
                // console.log("forecast data");
                // console.log(data);
                displayFiveDayForecast(data);
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

//--------------DISPLAY FUNCTIONS-----------------
function clearCurrentDisplay(){
    if(currentSearchEl){
        while(currentSearchEl.hasChildNodes()){
            var childEl = currentSearchEl.firstChild;
            currentSearchEl.removeChild(childEl);     
        }
    }
}
function clearForecastDisplay(){
    if(forecastContainerEl){
        while(forecastContainerEl.hasChildNodes()){
            var forecastChild = forecastContainerEl.firstChild;
            forecastContainerEl.removeChild(forecastChild);
        }
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
    weatherIcon.setAttribute("style", "width: 60px; height: 60px;");
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
function displayFiveDayForecast(data){
    clearForecastDisplay();
    // console.log(data);

    for(var i = 0; i < 40; i+=8){
        let dateCard = document.createElement("div");
        dateCard.classList = "rounded row";
        dateCard.setAttribute("id", "forecast-card");

        let date = formatForecastDate(data.list[i].dt_txt);
        // console.log(date);
        let dateEl = document.createElement("h4");
        dateEl.textContent = date;
        dateEl.classList = "font-weight-bold col-12";
        dateCard.appendChild(dateEl);

        let iconEl = document.createElement("img");
        // console.log(data.list[i].weather[0].icon);
        iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png");
        iconEl.setAttribute("alt", data.list[i].weather[0].description);
        iconEl.setAttribute("style", "width: 60px; height: 60px;");
        // iconEl.classList = "col-12";
        dateCard.appendChild(iconEl);

        let tempEl = document.createElement("span");
        // console.log(data.list[i].main.temp);
        tempEl.textContent = "Temp: " + data.list[i].main.temp + "°F";
        tempEl.classList = "col-12";
        dateCard.appendChild(tempEl);

        let windEl = document.createElement("span");
        // console.log(data.list[i].wind.speed);
        windEl.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
        windEl.classList = "col-12";
        dateCard.appendChild(windEl);

        let humidityEl = document.createElement("span");
        // console.log(data.list[i].main.humidity);
        humidityEl.textContent = "Humidity: " + data.list[i].main.humidity + "%";
        humidityEl.classList = "col-12";
        dateCard.appendChild(humidityEl);

        forecastContainerEl.appendChild(dateCard);
    }

}
function formatForecastDate(dateString){
    let dateArr = dateString.split("-");   //["yyyy", "mm", "dd 00:00:00"]
    let dayString = dateArr[2].split(" ");  //["dd", "00:00:00"]
    let formattedDate = dateArr[1] + "/" + dayString[0] + "/" + dateArr[0];
    return formattedDate;
}


//---------HISTORY SEARCH FUNCTIONS-----------------
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


//-------EVENT LISTENERS-------------
document.onload = createHistoryButtons();
userFormEl.addEventListener("submit", searchBtnHandler);
searchHistoryContainerEl.addEventListener("click", historyButtonHandler);