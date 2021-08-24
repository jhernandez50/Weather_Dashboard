function loadPage() {
    let citySearch = document.getElementById("city-search");
    let buttonSearch = document.getElementById("search-btn");
    let buttonClear = document.getElementById("clear-btn");
    let nameCity = document.getElementById("city-name");
    let todayPic = document.getElementById("current-pic");
    let todayTemp = document.getElementById("temperature");
    let todayHumidity = document.getElementById("humidity");4
    let todayWind = document.getElementById("windspeed");
    let todayUVE = document.getElementById("UVindex");
    let historyEl = document.getElementById("history");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    

    const APIKey = "f33a7a208bd903d4c709f22f9bdf0a68";


    function weatherApp(cityName) {

        let mapURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
      axios.get(mapURL)
        .then(function(response) {


            const currentDate = new Date(response.data.dt*1000);
            console.log(currentDate);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameCity.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = response.data.weather[0].icon;
            todayPic.setAttribute("src","https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
            todayPic.setAttribute("alt",response.data.weather[0].description);
            todayTemp.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            todayHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            todayWind.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
        let lat = response.data.coord.lat;
        let lon = response.data.coord.lon;
        
        let uvQuery = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
        axios.get(uvQuery)
        .then(function(response){

            let UVIndex = document.createElement("span");
            UVIndex.setAttribute("class","badge badge-danger");
            UVIndex.innerHTML = response.data[0].value;
            todayUVE.innerHTML = "UV Index: ";
            todayUVE.append(UVIndex);
        });

        let cityID = response.data.id;
        let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
        axios.get(forecastURL)
        .then(function(response){
            console.log(response);
            const forecastEls = document.querySelectorAll(".forecast");
            for (i=0; i<forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";
                const forecastIndex = i*8 + 4;
                const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class","mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);
                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute("src","https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                forecastWeatherEl.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                forecastEls[i].append(forecastWeatherEl);
                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                forecastEls[i].append(forecastTempEl);
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                forecastEls[i].append(forecastHumidityEl);
                }
            })
        });  
    }

    buttonSearch.addEventListener("click",function() {
        const searchTerm = citySearch.value;
        weatherApp(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search",JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    buttonClear.addEventListener("click",function() {
        searchHistory = [];
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) *1.8 +32);
    }

    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i=0; i<searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            // <input type="text" readonly class="form-control-plaintext" id="staticEmail" value="email@example.com"></input>
            historyItem.setAttribute("type","text");
            historyItem.setAttribute("readonly",true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click",function() {
                weatherApp(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }




}
loadPage();