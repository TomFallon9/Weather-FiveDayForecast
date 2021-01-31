let searchArr = [];
let APIKey = "&appid=cdcdc694ce3c89939dbff9480a305f92";

let city = $(".city");
let wind = $(".wind");
let temp = $(".temp");
let humidity = $(".humidity");


$(document).ready(function () {
  renderSearchList();
  //Search button click function with prevent default
  $("#searchBtn").click(function (event) {
    event.preventDefault();

    let searchTerm = $("#search").val().trim();
    btnSearch(searchTerm);
  })

  function btnSearch(citySearch) {
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&units=imperial" + APIKey;

    //add cities searched to list
    $("<button>").text(citySearch).prepend(".list-group-item");
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {

      let previousCity = JSON.parse(localStorage.getItem("cities"));

      if (previousCity) {
        previousCity.push(response.name);
        localStorage.setItem("cities", JSON.stringify(previousCity));
      } else {
        searchArr.push(response.name)
        localStorage.setItem("cities", JSON.stringify(searchArr));
      }
     //
      let cityName = $(".jumbotron").addClass("city-weather").text(citySearch);
      let currentDate = moment().format(" MM-DD-YYYY");
      let iconE1 = response.weather[0].icon;
      let iconurl = "https://openweathermap.org/img/w/" + iconE1 + ".png";
      let weatherImg = $("<img>").attr("src", iconurl);

      let windData = $("<p>").text("Wind Speed: " + response.wind.speed + "MPH").addClass("detail");
      let humidityData = $("<p>").text("Humidity: " + response.main.humidity + "%").addClass("detail");

      $("#forecast").empty();

      let tempData = $("<p>").text("Temp: " + response.main.temp + "°F").addClass("detail");

      //append all
      cityName.append(weatherImg);
      cityName.append(currentDate);
      cityName.append(windData);
      cityName.append(humidityData);
      cityName.append(tempData);
      $("container").append(cityName);

      //UV index call
      let latitude = response.coord.lat;
      let longitude = response.coord.lon;
      let uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?" + APIKey + "&lat=" + latitude + "&lon=" + longitude;

      $.ajax({
        url: uvIndexURL,
        method: "GET",
      }).then(function (UVinfo) {
        let currentUV = $("<div>").addClass('detail uv-index').text("UV Index: ");
        let uvValue = $("#current-uv-level").text(UVinfo.value);
        currentUV.append(uvValue);
        if (UVinfo.value < 3) {
          $(uvValue).addClass("uv-low");
        } else if (UVinfo.value < 6) {
          $(uvValue).addClass("uv-mild");
        } else if (UVinfo.value < 8) {
          $(uvValue).addClass("uv-warning");
        } else if (UVinfo.value < 11) {
          $(uvValue).addClass("uv-high");
        } else if (UVinfo.value >= 11) {
          $(uvValue).addClass("uv-extreme");
        }
        cityName.append(currentUV);
        renderSearchList();
      })
      // Five day forecast begins
      let forecastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial" + APIKey;

      for (let i = 1; i < 6; i++) {
        $.ajax({
          url: forecastURL,
          method: "GET",
        }).then(function (response5Day) {
          let cardbodyElem = $("<div>").addClass("card-body");

          let fiveDayCard = $("<div>").addClass(".cardbody");
          let fiveDate = $("<h5>").text(moment.unix(response5Day.daily[i].dt).format("MM/DD/YYYY"));
          fiveDayCard.addClass("headline");

          let fiveDayTemp = $("<p>").text("Temp: " + response5Day.daily[i].temp.max + "°");
          fiveDayTemp.attr("id", "#fiveDayTemp[i]");

          let fiveHumidity = $("<p>").attr("id", "humDay").text("Humidity: " + JSON.stringify(response5Day.daily[i].humidity) + "%");
          fiveHumidity.attr("id", "#fiveHumidity[i]");

          let iconE1 = response5Day.daily[i].weather[0].icon;
          let iconURL = "https://openweathermap.org/img/w/" + iconE1 + ".png";
          let weatherImgDay = $("<img>").attr("src", iconURL);
          $("#testImage").attr("src", iconURL);

          cardbodyElem.append(fiveDate);
          cardbodyElem.append(weatherImgDay);
          cardbodyElem.append(fiveDayTemp);
          cardbodyElem.append(fiveHumidity);
          fiveDayCard.append(cardbodyElem);
          $("#forecast").append(fiveDayCard);
          $("#fiveDayTemp[i]").empty();
          $(".jumbotron").append(cardbodyElem);
        })
      }
      $("#search").val("");

    })

  }
  $(document).on("click", ".city-btn", function () {
    JSON.parse(localStorage.getItem("cities"));
    let citySearch = $(this).text();
    btnSearch(citySearch);
  });

  function renderSearchList() {
    let searchList = JSON.parse(localStorage.getItem("cities"));
    $("#search-list").empty();
    if (searchList) {
      for (i = 0; i < searchList.length; i++) {
        let listBtn = $("<button>").addClass("btn btn-secondary city-btn").attr('id', 'cityname_' + (i + 1)).text(searchList[i]);
        let listElem = $("<li>").attr('class', 'list-group-item');
        listElem.append(listBtn);
        $("#search-list").append(listElem);
      }

    }

  }

})