const todoBox = document.querySelector(".todo-box");
const todoBtn = document.querySelector(".side-todo-btn");
const todoCloseBtn = document.querySelector(".todoCloseBtn");
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-form input");
const todoList = document.querySelector(".todo-list");
const filterBtns = document.querySelectorAll(".filter-btn");

const plannerBox = document.querySelector(".planner-box");
const plannerBtn = document.querySelector(".side-plan-btn");
const timeField = document.querySelector(".time-field");
const planTime = document.querySelector("#planTime");
const selectedTime = document.querySelector("#selectedTime");

const plannerForm = document.querySelector(".planner-form");
const plannerList = document.querySelector(".planner-list");
const plannerItem = document.querySelector(".planner-item");
const plannerInput = document.querySelector(".planner-form input[type='text']");
const plannerCloseBtn = document.querySelector(".plannerCloseBtn");

const dateBox = document.querySelector("#date");
const timeBox = document.querySelector("#time");

const quoteBox = document.querySelector(".quotes-box");
const quoteBtn = document.querySelector(".side-quote-btn");
const quoteCloseBtn = document.querySelector(".quotesCloseBtn");

const quotesList = document.querySelector(".quotes-list");
const quoteAuthor = document.querySelector(".quoteAuthor");
const newQuoteBtn = document.querySelector(".new-quote-btn");
const dashQuoteBtn = document.querySelector("#newQuoteBtn");
const quoteText = document.querySelector("#quote-text");

const tempEl = document.querySelector("#temp");
const conditionEl = document.querySelector("#condition");
const humidityEl = document.querySelector("#humidity");
const windEl = document.querySelector("#wind");
const feelsLikeEl = document.querySelector("#feelsLike");
const weatherLocationEl = document.querySelector("#weatherLocation");

let todos = [];
let plans = [];
let currentFilter = "all";

function closeAllBoxes() {
  todoBox.style.display = "none";
  plannerBox.style.display = "none";
  quoteBox.style.display = "none";
}

todoBtn.addEventListener("click", () => {
  closeAllBoxes();
  todoBox.style.display = "flex";
});

todoCloseBtn.addEventListener("click", () => {
  todoBox.style.display = "none";
});

plannerBtn.addEventListener("click", () => {
  closeAllBoxes();
  plannerBox.style.display = "flex";
});

plannerCloseBtn.addEventListener("click", () => {
  plannerBox.style.display = "none";
});
timeField.addEventListener("click", () => {
  planTime.showPicker();
});

planTime.addEventListener("change", () => {
  selectedTime.innerText = planTime.value;
});

quoteBtn.addEventListener("click", () => {
  closeAllBoxes();
  quoteBox.style.display = "flex";
  getQuote();
});

quoteCloseBtn.addEventListener("click", () => {
  quoteBox.style.display = "none";
});
// todo submit event
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let taskValue = todoInput.value.trim();

  if (taskValue === "") {
    alert("Enter your Task");
    return;
  }

  let taskObj = {
    id: Date.now(),
    title: taskValue,
    completed: false,
    important: false,
  };

  todos.push(taskObj);
  todoInput.value = "";
  renderTodos();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    console.log(currentFilter);

    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderTodos();
  });
});

// plan submit

plannerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let planValue = plannerInput.value.trim();
  let selectedTimeValue = planTime.value;

  if (planValue === "" || selectedTimeValue === "") {
    alert("Please Enter your plan and select time");
    return;
  }

  let planObj = {
    id: Date.now(),
    title: planValue,
    time: selectedTimeValue,
  };

  plans.push(planObj);
  renderPlans();
  plannerInput.value = "";
  planTime.value = "";
});

//  todo render

function renderTodos() {
  todoList.innerHTML = "";

  let filteredTodos = todos;

  if (currentFilter === "pending") {
    filteredTodos = todos.filter((task) => task.completed === false);
  }

  if (currentFilter === "completed") {
    filteredTodos = todos.filter((task) => task.completed === true);
  }

  filteredTodos.forEach((task) => {
    let div = document.createElement("div");
    div.classList.add("todo-item");

    if (task.completed) {
      div.classList.add("completed");
    }

    div.innerHTML = `<input type="checkbox"
    ${task.completed ? "checked" : ""}
        onchange="toggleTodo(${task.id})" />

            <p>${task.title}</p>

            <div class="todo-actions">

               <button onclick="toggleImportant(${task.id})" class="star-btn">
                        <i class="${task.important ? "ri-star-fill" : "ri-star-line"}"></i>
                </button>
               <button onclick="deleteTodo(${task.id})"><i class="ri-delete-bin-line"></i></button>
            </div>`;

    todoList.appendChild(div);
  });
}

function deleteTodo(id) {
  todos = todos.filter((task) => {
    return task.id !== id;
  });
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed,
      };
    }
    return task;
  });
  renderTodos();
}

function toggleImportant(id) {
  todos = todos.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        important: !task.important,
      };
    }

    return task;
  });

  renderTodos();
}

function renderPlans() {
  plannerList.innerHTML = "";

  plans.forEach((plan) => {
    let div = document.createElement("div");
    div.classList.add("planner-item");

    div.innerHTML = `
            <span class="plan-time">
              <i class="ri-time-line"></i>
              ${plan.time}
            </span>

            <p>${plan.title}</p>

            <div class="planner-actions">

              <button onclick="deletePlan(${plan.id})" class="delete-btn">
                <i class="ri-delete-bin-line"></i>
              </button>
          </div>`;

    plannerList.appendChild(div);
  });
}

function deletePlan(id) {
  plans = plans.filter((plan) => {
    return plan.id !== id;
  });

  renderPlans();
}

function updateDateTime() {
  let now = new Date();

  dateBox.innerText = now.toDateString();

  timeBox.innerText = now.toLocaleTimeString();
}

setInterval(updateDateTime, 1000);
updateDateTime();

newQuoteBtn.addEventListener("click", () => {
  getQuote();
});
dashQuoteBtn.addEventListener("click", () => {
  getDashboardQuote();
});
// quotes

async function getQuote() {
  try {
    // Button ko loading state me daal rahe hain
    newQuoteBtn.disabled = true;
    newQuoteBtn.innerText = "Loading...";

    const response = await fetch("https://dummyjson.com/quotes/random");

    if (!response.ok) {
      throw new Error("Quote API response failed");
    }

    const data = await response.json();

    quotesList.innerHTML = `
      <div class="quote-item">

        <p>${data.quote}</p>

        <span class="quote-author">
          — ${data.author}
        </span>
      </div>
    `;
  } catch (error) {
    // quotesList.innerHTML = `
    //   <div class="quote-item">
    //     <div class="quote-icon">!</div>
    //     <p>Quote load nahi ho paya. Please try again.</p>
    //     <span class="quote-author">
    //       — Error
    //     </span>
    //   </div>
    // `;
  } finally {
    newQuoteBtn.disabled = false;
    newQuoteBtn.innerText = "New Quote";
  }
}
async function getDashboardQuote() {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();

    quoteText.innerText = data.quote;
  } catch (error) {}
}

//

function loadWeather() {
  conditionEl.innerText = "Getting your location...";
  weatherLocationEl.innerText = "📍 Locating...";

  if (!navigator.geolocation) {
    conditionEl.innerText = "Location not supported";

    // Faridabad fallback
    getWeather(28.4089, 77.3178, "Faridabad, Haryana");

    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      getWeather(latitude, longitude);
      getCityName(latitude, longitude);
    },

    function (error) {
      conditionEl.innerText = "Location denied, showing default city";

      // Permission deny hone par Faridabad
      getWeather(28.4089, 77.3178, "Faridabad, Haryana");
    },
  );
}

async function getWeather(latitude, longitude, locationName) {
  try {
    conditionEl.innerText = "Loading weather...";

    const apiUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code` +
      `&timezone=auto`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Weather API failed");
    }

    const data = await response.json();

    const weather = data.current;

    tempEl.innerText = `${Math.round(weather.temperature_2m)}°C`;

    humidityEl.innerText = `${weather.relative_humidity_2m}%`;

    windEl.innerText = `${weather.wind_speed_10m} km/h`;

    feelsLikeEl.innerText = `${Math.round(weather.apparent_temperature)}°C`;

    conditionEl.innerText = getWeatherCondition(weather.weather_code);

    if (locationName) {
      weatherLocationEl.innerText = `📍 ${locationName}`;
    }
  } catch (error) {
    console.log("Weather error:", error);

    tempEl.innerText = "--°C";
    humidityEl.innerText = "--%";
    windEl.innerText = "-- km/h";
    feelsLikeEl.innerText = "--°C";

    conditionEl.innerText = "Weather unavailable";
    // weatherLocationEl.innerText = "📍 Location unavailable";
  }
}

async function getCityName(lat, lon) {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error("Geocoding API failed");
    }

    const data = await response.json();
    console.log(data);

    const city =
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      "Unknown";

    const state = data.principalSubdivision || data.countryName || "";

    weatherLocationEl.innerText = state
      ? `📍 ${city}, ${state}`
      : `📍 ${city}`;
  } catch (error) {
    console.log(error);
    weatherLocationEl.innerText = "📍 Current Location";
  }
}

function getWeatherCondition(code) {
  if (code === 0) {
    return "Clear sky";
  }

  if (code === 1) {
    return "Mainly clear";
  }

  if (code === 2) {
    return "Partly cloudy";
  }

  if (code === 3) {
    return "Overcast";
  }

  if (code === 45 || code === 48) {
    return "Foggy";
  }

  if (code >= 51 && code <= 57) {
    return "Drizzle";
  }

  if (code >= 61 && code <= 67) {
    return "Rain";
  }

  if (code >= 71 && code <= 77) {
    return "Snow";
  }

  if (code >= 80 && code <= 82) {
    return "Rain showers";
  }

  if (code >= 95) {
    return "Thunderstorm";
  }

  return "Current weather";
}

loadWeather()