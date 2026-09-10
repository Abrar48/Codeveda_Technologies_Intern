const taskInput = document.getElementById('taskInput');
const taskTimeInput = document.getElementById('taskTimeInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = "";
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        if (task.completed) {
            li.classList.add('completed');
        }

        let timeDisplay = task.time ? task.time : "No time set";

        li.innerHTML = `
            <div class="task-info" onclick="toggleTask(${index})">
                <span class="task-text">${task.text}</span>
                <span class="task-time">${timeDisplay}</span>
            </div>
            <button onclick="deleteTask(${index})" class="delete-btn">Delete</button>
        `;
        
        taskList.appendChild(li);
    });
}

addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const timeValue = taskTimeInput.value;
    
    if (text !== "") {
        let formattedTime = "";
        
        if (timeValue) {
            const dateObj = new Date(timeValue);
            formattedTime = dateObj.toLocaleDateString() + ' at ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        tasks.push({ text: text, completed: false, time: formattedTime });
        taskInput.value = "";
        taskTimeInput.value = "";
        saveAndRender();
    }
});

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

renderTasks();