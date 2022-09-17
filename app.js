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
        pColor = "danger";
      } else if (priority === "middle") {
        pColor = "warning";
      } else {
        pColor = "info";
      }

      id = Date.now();

      // if (data.todos.length > 0) {
      //   id = data.todos[data.todos.length - 1].id + 1;
      // } else {
      //   id = 0;
      // }

      const newTodo = new Todo(id, todoText, date, status, priority, pColor);
      //console.log(newTodo);
      data.todos.push(newTodo);
      //console.log(data.todos);
      return newTodo;
    },

    deleteTodoFromArray: function (selectedData) {
      data.todos.forEach((todo, index) => {
        //console.log(todo.id);
        //console.log(selectedData);
        if (selectedData == todo.id) {
          data.todos.splice(index, 1);
        }
      });
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
    radioOpt: "input[name='options']",
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
                  >${todo.todo} </span
                >
                <span>
                <span  class="badge text-bg-${todo.pColor}"> ${todo.date}</span>
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
                  >${todo.todo} </span
                >
                <span>
                  <span class="badge text-bg-${todo.pColor}"> ${todo.date}</span>
                  <button id="delete-will" data-id="${todo.id}" class="delBtn btn btn-danger ms-2 text-light">X</button>
                </span>
              </li>
      `;

      document.querySelector(Selectors.todoListWill).innerHTML += item;
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
      if (e.target.className === "delBtn btn btn-danger ms-2 text-light") {
        document
          .querySelector(Selectors.deleteWill)
          .parentElement.parentElement.remove();
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
    //const priorities = document.querySelectorAll(UISelector.radioOpt);
    const prioritySelected = document.querySelector(UISelector.selectOpt).value;
    console.log(prioritySelected);

    let selectedPriority;

    selectedPriority = prioritySelected;

    // priorities.forEach((p) => {
    //   if (p.checked == true) {
    //     selectedPriority = p.value;
    //   }
    // });

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

    UICtrl.updateNumOfTodos(todos);

    e.preventDefault();
  };

  return {
    init: function () {
      console.log("starting app....");
      const todos = TodoCtrl.getTodos();

      if (todos.length == 0) {
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
