const todoForm = document.getElementById("todo-form");
const todoList = document.getElementById("todo-list");
const submitBtn = document.querySelector(".submitBtn");
const content = document.getElementById("content");


function submitAddTodo(event) {
    event.preventDefault();
    const todoText = content.value.trim();    
    if (todoText === '') return; 

    const newTodo = {
        text: todoText,
        id: Date.now(),
    };

    let todos = JSON.parse(window.localStorage.getItem('todos')) || [];
    if (!Array.isArray(todos)) {
        todos = []; // 문자열로 저장된 경우 빈 배열로 초기화
    }
    todos.push(newTodo);

    paintTodo(newTodo);
    saveTodos(todos);
    content.value = '';
}

todoForm.addEventListener("submit", submitAddTodo)

function paintTodo(todo) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    const button = document.createElement('button');

    li.id = todo.id;
    span.innerText = todo.text;
    button.innerText = '삭제';
    button.addEventListener('click', (event) => {
        deleteTodo(event);
    });
    li.appendChild(span);
    li.appendChild(button);
    todoList.appendChild(li);
}

function deleteTodo(event) {
    const li = event.target.parentElement;
    const todoText = li.querySelector("span").innerText;


    const todoId = parseInt(li.id, 10);
    let todos = JSON.parse(window.localStorage.getItem('todos')) || [];
    todos = todos.filter(t => t.id !== todoId);
    saveTodos(todos);

    li.remove();

}

function saveTodos(todos) {
    window.localStorage.setItem('todos', JSON.stringify(todos));
}

function init() {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
        savedTodos.forEach(todo => paintTodo(todo));
    }
}

init();