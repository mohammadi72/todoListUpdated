// form => submit => create new Todo =>{id, createdAt, title, isCompleted }
// const todos = [] => todos.push(new todo)
// let todos = [];
let filterValue = "all";
let editId = 0;
let newTitle = "";

// selecting :

const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const selectFilters = document.querySelector(".filter-todos");

let modal = document.querySelector(".modal");
let backDrop = document.querySelector(".backdrop");
let closeBtn = document.querySelector(".close-modal");
let confirmBtn = document.querySelector(".confirm-modal");
const editInput = document.querySelector("#edit-input");

// events :

todoForm.addEventListener("submit", addNewTodo);
selectFilters.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});

closeBtn.addEventListener("click", closeModal);
backDrop.addEventListener("click", closeModal);
confirmBtn.addEventListener("click", () => {
  editTitle(editId);
});
// functions :

function addNewTodo(e) {
  e.preventDefault();
  if (!todoInput.value) return null; //todoInput!== nothing
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };
  //todos.push(newTodo);
  saveTodo(newTodo);
  filterTodos();
}
function createTodos(todos) {
  // created todos in DOM
  let result = "";

  todos.forEach((todo) => {
    result += `<li class="todo">
   <p class="todo__title ${todo.isCompleted && "completed"}">${todo.title}</p>

   <span class="todo__createdAt">${new Date(todo.createdAt).toLocaleDateString(
     "fa-IR"
   )}</span>
   <button data-todo-id=${
     todo.id
   }  class="todo__edit"><i class="far fa-edit"></i></button>
   <button data-todo-id=${
     todo.id
   } class="todo__check"><i class="far fa-check-square"></i></button>
   <button data-todo-id=${
     todo.id
   } class="todo__remove"><i class="far fa-trash-alt"></i></button>
 </li> `;
  });

  todoList.innerHTML = result;
  todoInput.value = "";

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));

  const editBtns = [...document.querySelectorAll(".todo__edit")];
  editBtns.forEach((btn) => btn.addEventListener("click", editTodo));
}
function filterTodos() {
  let todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      //todos
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((todo) => todo.isCompleted);
      createTodos(filteredTodos);

      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((todo) => !todo.isCompleted);
      createTodos(filteredTodos);
      break;
    }

    default:
      createTodos(todos);
  }
}
function removeTodo(e) {
  let todos = getAllTodos();
  const removeId = Number(e.target.dataset.todoId);
  todos = todos.filter((todo) => todo.id !== removeId);
  savedAllTodos(todos);
  filterTodos();
}

function checkTodo(e) {
  let todos = getAllTodos();
  const checkId = Number(e.target.dataset.todoId);
  todos.forEach((todo) => {
    if (todo.id === checkId) todo.isCompleted = !todo.isCompleted;
  });
  savedAllTodos(todos);
  filterTodos();
}
function editTodo(e) {
  let todos = getAllTodos();
  editId = Number(e.target.dataset.todoId);
  modal.style.opacity = "1";
  modal.style.transform = "translateY(20vh)";
  backDrop.style.display = "block";
  todos.forEach((todo) => {
    if (todo.id === editId) {
      editInput.placeholder = todo.title;
    }
  });
}
function closeModal() {
  modal.style.opacity = "0";
  modal.style.transform = "translateY(-100vh)";
  backDrop.style.display = "none";
}
function editTitle(id) {
  let todos = getAllTodos();
  newTitle = editInput.value;
  todos.forEach((todo) => {
    if (todo.id === id) todo.title = newTitle;
  });
  savedAllTodos(todos);
  filterTodos();
  closeModal();
}
//localStorage => web API

function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}
function saveTodo(todo) {
  // const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];

  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function savedAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
