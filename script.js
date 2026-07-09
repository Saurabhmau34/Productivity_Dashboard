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

let todos = [];
let plans = [];
let currentFilter = "all";


function closeAllBoxes() {
  todoBox.style.display = "none";
  plannerBox.style.display = "none";
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

function deletePlan(id){
  plans = plans.filter((plan) => {
    return plan.id !== id;
  });

  renderPlans();
}