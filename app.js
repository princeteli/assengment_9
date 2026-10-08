const card = document.querySelectorAll(".card");
const dashboard = document.getElementById('dashboard')
const backButtons = document.querySelectorAll(".back-btn")
const dateTime = document.getElementById("date-time");
const themeBtn = document.getElementById("theme-btn");
const theme = localStorage.getItem("theme");
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote-btn");
const pomoTime = document.getElementById("pomo-time");
const pomoBtn = document.getElementById("pomo-btn");
const handleGoal = document.getElementById("handleGoal");
const goalList = document.getElementById("goal-list");
const goalProgress = document.getElementById("goal-progress");
const handlePlan = document.getElementById("handlePlan");
const planList = document.getElementById("plan-list");
const handleTask = document.getElementById("handleTask");
const taskList = document.getElementById("task-list");
const handleWeather = document.getElementById("handleWeather");



if (theme === "dark") {
    document.documentElement.classList.add("dark");
    themeBtn.textContent = "Light";
} else {
    document.documentElement.classList.remove("dark");
    themeBtn.textContent = "Dark";
}

themeBtn.addEventListener("click", function () {

    document.documentElement.classList.toggle("dark");
    let currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);

    if (document.documentElement.classList.contains("dark")) {
        themeBtn.textContent = "Light";
    } else {
        themeBtn.textContent = "Dark";
    }

});

// Update date and time
function updateDateTime() {
    const now = new Date();
    dateTime.textContent = now.toLocaleString();
}

updateDateTime();
setInterval(updateDateTime, 1000);

card.forEach(function (card) {
    card.addEventListener("click", function () {
        const data = card.getAttribute("data-feature");
        const feature = document.getElementById(data);
        if (feature) {
            feature.classList.remove("hidden");
            dashboard.classList.add("hidden");
        }
    })
})

backButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".feature").forEach(function (feature) {
            feature.classList.add("hidden");
        });
        dashboard.classList.remove("hidden");
    })
})

newQuoteBtn.addEventListener("click", async function () {
    const response = await fetch("https://dummyjson.com/quotes/random");
    const data = await response.json();
    console.log(data);
    quoteText.textContent = data.quote;
    quoteAuthor.textContent = `- ${data.author}`;
});

let pomoInterval = null;

pomoBtn.addEventListener("click", async function () {
    if (pomoInterval !== null) return;

    const time = pomoTime.textContent.trim().split(":");
    const minutes = parseInt(time[0], 10) || 0;
    const seconds = parseInt(time[1], 10) || 0;
    let remainingSeconds = minutes * 60 + seconds;
    updateDisplay();

    if (remainingSeconds <= 0) return;

    pomoInterval = setInterval(function () {
        remainingSeconds--;
        pomoTime.textContent = `${Math.floor(remainingSeconds / 60).toString().padStart(2, "0")}:${(remainingSeconds % 60).toString().padStart(2, "0")}`;

        if (remainingSeconds <= 0) {
            clearInterval(pomoInterval);
            pomoInterval = null;
        }
    }, 1000);
});

function updateDisplay() {
    const time = pomoTime.textContent.trim().split(":");
    const minutes = parseInt(time[0], 10) || 0;
    const seconds = parseInt(time[1], 10) || 0;
    pomoTime.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}



let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}


function renderGoals() {
    goalList.innerHTML = "";

    goals.forEach(function (goal, index) {
        const li = document.createElement("li");
        li.textContent = goal.text;
        li.dataset.index = index;

        li.classList.add("line-through", "text-gray-500", "dark:text-gray-400", "text-lg", "font-bold", "cursor-pointer", "font-semibold", "italic");
        if (goal.completed) {
            li.classList.add("line-through", "text-gray-500", "dark:text-gray-400", "text-green-500", "cursor-pointer", "font-semibold", "italic");
        } else {
            li.classList.remove("line-through", "text-gray-500", "dark:text-gray-400", "font-semibold", "italic");
        }

        goalList.appendChild(li);
    });

    const done = goals.filter(function (g) {
        return g.completed;
    }).length;

    goalProgress.textContent = `${done} of ${goals.length} completed`;
}

handleGoal.addEventListener("submit", function (e) {
    e.preventDefault();
    const goal = document.getElementById("goal");

    if (goal.value.trim() === "") return;

    goals.push({ text: goal.value.trim(), completed: false });
    saveGoals();
    renderGoals();
    goal.value = "";
});

goalList.addEventListener("click", function (e) {
    const li = e.target.closest("li");
    if (!li) return;

    const index = Number(li.dataset.index);
    if (Number.isNaN(index) || !goals[index]) return;

    goals[index].completed = !goals[index].completed;

    saveGoals();
    renderGoals();
});

renderGoals();


const plans = JSON.parse(localStorage.getItem("plans")) || [];

handlePlan.addEventListener("submit", function (e) {
    e.preventDefault();
    const planInput = document.getElementById("plan-inp");
    const planTime = document.getElementById("plan-time");
    plans.push({ plan: planInput.value, time: planTime.value });

    localStorage.setItem("plans", JSON.stringify(plans));
    renderPlans();
    planInput.value = "";
    planTime.value = "";
})

function renderPlans() {
    plans.forEach(function (plan) {
        const li = document.createElement("li");
        li.classList.add("text-lg", "font-semibold", "italic", "text-gray-700", "dark:text-gray-300");
        li.textContent = `${plan.plan} - ${plan.time}`;
        planList.appendChild(li);
    });
}
renderPlans();



const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

handleTask.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskInput = document.getElementById("task-inp");
    if(taskInput.value.trim() === "") return;

    tasks.push({ task: taskInput.value, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    taskInput.value = "";
})

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task, index) {
        const li = document.createElement("li");
        li.classList.add("text-lg", "font-semibold", "italic", "cursor-pointer");
        li.textContent = task.task;
        li.dataset.index = index;

        if (task.completed) {
            li.classList.add("line-through", "text-red-500");  
        } else {
            li.classList.add("text-gray-700", "dark:text-gray-300");
        }
        taskList.appendChild(li);
    });
}

renderTasks();

taskList.addEventListener("click", function (e) {
    const li = e.target.closest("li");
    if (!li) return;

    const index = li.dataset.index;
    tasks[index].completed = !tasks[index].completed;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
});


handleWeather.addEventListener("submit", async function (e) {
    e.preventDefault();
    const cityInput = document.getElementById("city-input");
    if (!cityInput) return;
    const city = cityInput.value.trim();
    if (city === "") return;

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`);
        const data = await response.json();
        document.getElementById("weather-info").innerHTML = `
            <h2 class="text-2xl font-bold mt-5 mb-5">Weather in ${data.name}</h2>
            <p class="text-lg font-semibold">Temperature: ${data.main.temp} °C</p>
            <p class="text-lg font-semibold">Weather: ${data.weather[0].description}</p>
        `;
        
    }
    catch (error) {
        console.error("Error fetching weather data:", error);
    }

})