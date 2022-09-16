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

      if (data.todos.length > 0) {
        id = data.todos[data.todos.length - 1].id + 1;
      } else {
        id = 0;
      }

      const newTodo = new Todo(id, todoText, date, status, priority, pColor);
      //console.log(newTodo);
      data.todos.push(newTodo);
      //console.log(data.todos);
      return newTodo;
    },

    deleteTodoFromArray: function (selectedData) {
      data.todos.forEach((todo, index) => {
        console.log(todo.id);
        console.log(selectedData);
        if (selectedData.id == todo.id) {
          console.log(data.todos.splice(index, 1));
        }
      });
    },
  };
})();

//? UI CONTROLLER
const UIController = (function () {
  const Selectors = {
    sectionWill: "#section-will",
    sectionDone: "#section-done",
    todoText: "#input-text",
    addBtn: "#add-btn",
    radioOpt: "input[name='options']",
    todoListWill: "#todo-list-will",
    todoListDone: "#todo-list-done",
    numOfActive: "#num-of-active",
    numOfPassive: "#num-of-passive",
    deleteWill: "#delete-will",
    deleteDone: "#delete-done",
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
                  ><input class="me-3" type="checkbox"  name="done" id="" />${todo.todo} </span
                >
                <span>
                <span  class="badge text-bg-${todo.pColor}"> ${todo.date}</span>
                <button id="delete-will" data="${todo.id}" class="btn btn-danger ms-2 text-light">X</button>
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
                  ><input class="me-3" type="checkbox"  name="done" id="" />${todo.todo} </span
                >
                <span>
                <span class="badge text-bg-${todo.pColor}"> ${todo.date}</span>
                <button id="delete-will" data="${todo.id}" class="btn btn-danger ms-2 text-light">X</button>
                </span>
              </li>
      `;

      document.querySelector(Selectors.todoListWill).innerHTML += item;
    },

    updateNumOfTodos: function (todos) {
      document.querySelector(
        Selectors.numOfActive
      ).textContent = `Available todos :  ${todos.length}`;
    },

    clearInputs: function () {
      document.querySelector(Selectors.todoText).value = "";
    },
    hideList: function () {
      document.querySelector(Selectors.sectionWill).style.display = "none";
    },
  };
})();
//? APP CONTROLLER
const App = (function (TodoCtrl, UICtrl) {
  const UISelector = UICtrl.getSelectors();

  //? Event Listeners

  const loadEventListeners = function () {
    ///add todo

    document
      .querySelector(UISelector.addBtn)
      .addEventListener("click", todoAdd);
  };

  const todos = TodoCtrl.getTodos();

  const todoAdd = function (e) {
    const todoText = document.querySelector(UISelector.todoText).value;
    const priorities = document.querySelectorAll(UISelector.radioOpt);

    let selectedPriority;
    priorities.forEach((p) => {
      if (p.checked == true) {
        selectedPriority = p.value;
      }
    });

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

      // deleete todo

      if (todos.length > 0) {
        console.log(todos.length);
        document
          .querySelector(UISelector.deleteWill)
          .addEventListener("click", function (e) {
            console.log(e.target);
          });
      }

      //clear input
      UICtrl.clearInputs();
    }

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
