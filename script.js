import { Todo } from "./components/Todo.js";

(function(){
    "use strict"

    const todo = new Todo({
        inputField: 'taskInput',
        addBtn: 'addTask',
        listContainer: 'todoList',
        saveBtn: 'saveList',
        deleteBtn: 'deleteList'
    });

    todo.init();

})();