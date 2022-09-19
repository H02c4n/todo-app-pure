//? STORAGE CONTROLLER
const StorageController = (function () {})();

//? TODO CONTROLLER
const TodoController = (function () {
  const Todo = function (id, todo, date, status, priority, pColor) {
    this.id = id;
    this.todo = todo;
    this.date = date;
    this.status = status;
    this.priority = priority;
    this.pColor = pColor;
  };

  const data = {
    todos: [],
    selectedTodo: null,
  };

  return {
    getTodos: function () {
      return data.todos;
    },

    getTodosLength: function () {
      console.log(data.todos.length);
    },

    getData: function () {
      return data;
    },

    getCurrentTodo: function () {
      return data.selectedTodo;
    },

    addTodoToArray: function (todoText, priority) {
      let id;
      let date = new Date().toLocaleDateString();
      let status = false;
      let pColor;

      if (priority === "high") {
        pColor = "angles-up";
      } else if (priority === "middle") {
        pColor = "equals";
      } else {
        pColor = "angles-down";
      }

      id = Date.now();

      const newTodo = new Todo(id, todoText, date, status, priority, pColor);
      //console.log(newTodo);
      data.todos.push(newTodo);
      //console.log(data.todos);
      return newTodo;
    },

    deleteTodoFromArray: function (selectedData) {
      data.todos = data.todos.filter((todo) => todo.id != selectedData);
    },
  };
})();

//? UI CONTROLLER
const UIController = (function (TodoCtrl) {
  const Selectors = {
    sectionWill: "#section-will",
    sectionDone: "#section-done",
    todoText: "#input-text",
    addBtn: "#add-btn",
    selectOpt: "select[name='options']",
    todoListWill: "#todo-list-will",
    todoListDone: "#todo-list-done",
    numOfActive: "#num-of-active",
    numOfPassive: "#num-of-passive",
    deleteWill: "#delete-will",
    deleteDone: "#delete-done",
    delBtns: ".delBtn",
  };

  return {
    createTodoList: function (todos) {
      let html = "";

      todos.forEach((todo) => {
        html += `
      <li
                class="list-group-item d-flex justify-content-between align-items-center fs-4"
              >
                <span class="todo-text"
                  >${todo.todo} <i class="fa-solid fa-${todo.pColor} ms-2"></i></span
                >
                <span>
                <span  class="badge"> ${todo.date}</span>
                <button id="delete-will" data-id="${todo.id}" class="delBtn btn btn-danger ms-2 text-light">X</button>
                </span>
              </li>
      `;
      });

      document.querySelector(Selectors.todoListWill).innerHTML = html;
    },

    getSelectors: function () {
      return Selectors;
    },

    addTodoToDom: function (todo) {
      document.querySelector(Selectors.sectionWill).style.display = "block";
      var item = `
      <li
                class="list-group-item d-flex justify-content-between align-items-center fs-4"
              >
                <span class="todo-text"
                  >${todo.todo} <i class="fa-solid fa-${todo.pColor} ms-2"></i></span
                >
                <span>
                  <span class="badge text-info"> ${todo.date}</span>
                  <button id="delete-will" data-id="${todo.id}" class="delBtn btn btn-danger ms-2 text-light">X</button>
                </span>
              </li>
      `;

      document.querySelector(Selectors.todoListWill).innerHTML += item;
      document.querySelector(Selectors.todoText).focus();
    },

    updateNumOfTodos: function (todos) {
      if (todos.length == 0) {
        this.hideList();
      } else {
        document.querySelector(
          Selectors.numOfActive
        ).textContent = `Available todos :  ${todos.length}`;
      }
    },

    clearInputs: function () {
      document.querySelector(Selectors.todoText).value = "";
    },
    hideList: function () {
      document.querySelector(Selectors.sectionWill).style.display = "none";
    },

    deleteTodoFromDom: function (e) {
      if (e.target.classList.contains("btn-danger")) {
        e.target.parentElement.parentElement.remove();
      }
    },
  };
})(TodoController);

//? APP CONTROLLER
const App = (function (TodoCtrl, UICtrl) {
  const UISelector = UICtrl.getSelectors();

  //? Event Listeners

  const loadEventListeners = function () {
    ///add todo

    document
      .querySelector(UISelector.addBtn)
      .addEventListener("click", todoAdd);
    document
      .querySelector(UISelector.todoListWill)
      .addEventListener("click", deleteTodo);
  };

  const todos = TodoCtrl.getTodos();

  const todoAdd = function (e) {
    const todoText = document.querySelector(UISelector.todoText).value;
    const prioritySelected = document.querySelector(UISelector.selectOpt).value;

    let selectedPriority;

    selectedPriority = prioritySelected;

    if (
      todoText !== "" &&
      (selectedPriority == "high" ||
        selectedPriority == "middle" ||
        selectedPriority == "low")
    ) {
      ///add todo to array
      const newTodo = TodoCtrl.addTodoToArray(todoText, selectedPriority);

      /// add todo to list DOM
      UICtrl.addTodoToDom(newTodo);

      const todos = TodoCtrl.getTodos();

      /// update
      UICtrl.updateNumOfTodos(todos);

      //clear input
      UICtrl.clearInputs();
    }

    e.preventDefault();
  };

  /// Delete todo
  const deleteTodo = function (e) {
    const selectedData = e.target.dataset.id;

    // delete from array
    TodoCtrl.deleteTodoFromArray(selectedData);

    //delete from Dom

    UICtrl.deleteTodoFromDom(e);

    const todos = TodoCtrl.getTodos();

    UICtrl.updateNumOfTodos(todos);

    e.preventDefault();
  };

  return {
    init: function () {
      console.log("starting app....");
      const todos = TodoCtrl.getTodos();

      if (todos.length < 1) {
        UICtrl.hideList();
      } else {
        UICtrl.createTodoList(todos);
      }

      ///Load event listeners
      loadEventListeners();
    },
  };
})(TodoController, UIController);

App.init();
