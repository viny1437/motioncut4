document.addEventListener('DOMContentLoaded', loadTasks);

const todoForm = document.getElementById('todo-form');
const newTaskInput = document.getElementById('new-task');
const taskCategorySelect = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const searchTaskInput = document.getElementById('search-task');
const clearAllButton = document.getElementById('clear-all');

todoForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskActions);
searchTaskInput.addEventListener('input', filterTasks);
clearAllButton.addEventListener('click', clearAllTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(e) {
    e.preventDefault();

    const taskText = newTaskInput.value.trim();
    const taskCategory = taskCategorySelect.value.trim();
    if (taskText === '') return;

    const task = { id: Date.now(), text: taskText, category: taskCategory, completed: false };
    renderTask(task);
    saveTaskToLocalStorage(task);
    newTaskInput.value = '';
    taskCategorySelect.value = '';
}

function renderTask(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = task.completed ? 'completed' : '';

    li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <span class="task-category">${task.category}</span>
        <div class="task-actions">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <button class="complete">${task.completed ? 'Uncomplete' : 'Complete'}</button>
        </div>
    `;

    taskList.appendChild(li);
}

function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    saveTasks(tasks);
}

function handleTaskActions(e) {
    const target = e.target;
    const li = target.closest('li');
    const taskId = li.dataset.id;

    if (target.classList.contains('edit')) {
        editTask(li, taskId);
    } else if (target.classList.contains('delete')) {
        deleteTask(li, taskId);
    } else if (target.classList.contains('complete')) {
        toggleTaskComplete(li, taskId);
    }
}

function editTask(li, taskId) {
    const taskText = li.querySelector('.task-text');
    const taskCategory = li.querySelector('.task-category');
    const newTaskText = prompt('Edit task:', taskText.textContent);
    const newTaskCategory = prompt('Edit category:', taskCategory.textContent);

    if (newTaskText !== null && newTaskText.trim() !== '') {
        taskText.textContent = newTaskText;
        taskCategory.textContent = newTaskCategory;
        updateTaskInLocalStorage(taskId, { text: newTaskText, category: newTaskCategory });
    }
}

function deleteTask(li, taskId) {
    li.remove();
    removeTaskFromLocalStorage(taskId);
}

function toggleTaskComplete(li, taskId) {
    const isCompleted = li.classList.toggle('completed');
    const completeButton = li.querySelector('.complete');
    completeButton.textContent = isCompleted ? 'Uncomplete' : 'Complete';

    updateTaskInLocalStorage(taskId, { completed: isCompleted });
}

function updateTaskInLocalStorage(taskId, updates) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id == taskId);
    if (taskIndex > -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        saveTasks(tasks);
    }
}

function removeTaskFromLocalStorage(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != taskId);
    saveTasks(tasks);
}

function filterTasks() {
    const searchText = searchTaskInput.value.toLowerCase();
    const tasks = taskList.querySelectorAll('li');
    
    tasks.forEach(task => {
        const taskText = task.querySelector('.task-text').textContent.toLowerCase();
        if (taskText.includes(searchText)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function clearAllTasks() {
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
}
