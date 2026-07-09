const todoBox = document.querySelector(".todo-box");
const todoBtn = document.querySelector(".side-todo-btn");
const closeBtn = document.querySelector(".closeBtn");
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-form input");
const todoList = document.querySelector(".todo-list");
const filterBtns = document.querySelectorAll(".filter-btn");

const plannerBox = document.querySelector(".planner-box");
const plannerBtn = document.querySelector(".side-plan-btn");
const timeField = document.querySelector(".time-field");
const planTime = document.querySelector("#planTime");
const selectedTime = document.querySelector("#selectedTime");


let todos = [];
let currentFilter = "all";


todoBtn.addEventListener("click", () => {
  todoBox.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  todoBox.style.display = "none";
});


plannerBtn.addEventListener("click", () => {
  plannerBox.style.display = "flex";
});

timeField.addEventListener("click", () => {
  planTime.showPicker();
});

planTime.addEventListener("change", () => {
  selectedTime.innerText = planTime.value;
});

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
