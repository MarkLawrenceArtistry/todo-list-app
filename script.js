(function() {

    const isDatabaseThere = JSON.parse(localStorage.getItem('tasks'));
    const checkDatabase = (isDatabaseThere) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(isDatabaseThere) {
                    resolve(true);
                } else {
                    reject('Error fetching the database!');
                }
            }, 5000)
        })
    }

    checkDatabase(isDatabaseThere).then((resolve) => {
        if(resolve === true) {
            alert('Success! You can now use the app.');
            console.log('Success! You can now use the app.');

            document.querySelector('#spinner').style.display = 'none';
            let myLabel = document.querySelector('.myLabel');
            let myInput = document.querySelector('#task-message');
            let myBtn = document.querySelector('#submit-btn');

            const elementsToHide = [myLabel, myInput, myBtn];

            const hiddenStyle = { display: 'none' };
            const visibleStyle = { display: 'block' };
            
            elementsToHide.forEach(element => {
                if (element) {
                    Object.assign(element.style, visibleStyle);
                }
            });

            initializeApp();
        }
    }).catch((reject) => {
        alert(reject);
    })

    function initializeApp() {
        // Utility Functions
        const getStorage = (key) => { return JSON.parse(localStorage.getItem(`${key}`)) }
        const setStorage = (key, value) => { localStorage.setItem(`${key}`, JSON.stringify(value)) }

        // Form Handler
        const taskForm = document.querySelector('#task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const taskMessage = document.querySelector('#task-message').value.trim();
                if(taskMessage === null || !taskMessage) {
                    alert('Oops! You entered a blank task.');
                    return;
                }

                const tasks = getStorage('tasks') || [];
                const taskFound = tasks.find(e => e.taskMessage === taskMessage);
                if(taskFound) {
                    alert('Oops! You entered a duplicated task.');
                    return;
                }

                const newTask = {
                    id: Date.now(),
                    taskMessage: taskMessage,
                    status: 'not completed'
                }

                tasks.push(newTask);
                setStorage('tasks', tasks);

                const newTasks = getStorage('tasks');

                alert('You nailed it! Task added successfully.');
                taskForm.reset();
                displayTasks();
            })
        }

        // Display Functions
        const displayTasks = () => {
            const tasksDiv = document.querySelector('#tasks-div');
            const tasks = getStorage('tasks') || [];

            tasksDiv.innerHTML = '';

            tasks.forEach(e => {
                const taskDiv = document.createElement('div');
                let taskMsg = '';
                let taskStatusCheck = '';

                if(e.status === 'not completed') {
                    taskMsg = `<p class="task-message">${e.taskMessage}</p>`;
                    taskStatusCheck = `<input type="checkbox" class="task-check">`
                } else {
                    taskMsg = `<p class="task-message"><del>${e.taskMessage}</del></p>`;
                    taskStatusCheck = `<input type="checkbox" class="task-check" checked>`
                }

                taskDiv.innerHTML = `
                    <div class="task-instance">
                        <div class="task-instance-message">
                            ${taskMsg}
                            <p class="task-status">${e.status}</p>
                        </div>
                        <div class="task-instance-controls">
                            ${taskStatusCheck}
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </div>
                    </div>
                `;

                tasksDiv.appendChild(taskDiv);

                // 1. target the button by its parent div (taskDiv)
                // 2. add an event listener to it
                // 3. inside you can pass in the current element object (task)
                // 3.5. the current element object in tasks array(inside this forEach) in which we display in the document
                // 4. add a function that accepts the element as argument to modify that certain element object
                const deleteBtn = taskDiv.querySelector('.delete-btn');
                deleteBtn.addEventListener('click', () => {
                    deleteTask(e.id); 
                });

                const editBtn = taskDiv.querySelector('.edit-btn');
                editBtn.addEventListener('click', () => {
                    editTask(e.id); 
                });

                const myCheckBox = taskDiv.querySelector('.task-check');
                myCheckBox.addEventListener('change', () => {
                    if (myCheckBox.checked == true) {
                        editStatusTask(e.id, true);
                    } else {
                        editStatusTask(e.id, false);
                    }
                })
            })
        }

        const deleteTask = (id) => {
            let tasks = getStorage('tasks') || [];

            const taskIndex = tasks.findIndex(task => task.id === id);
            tasks.splice(taskIndex, 1);

            setStorage('tasks', tasks);
            displayTasks();
        }

        const editTask = (id) => {
            let tasks = getStorage('tasks') || [];

            const taskIndex = tasks.findIndex(task => task.id === id);
            const taskFound = tasks.find(task => task.id === id);

            let newTaskMessage = window.prompt(`Edit task ${taskFound.taskMessage}.`);
            if(newTaskMessage === null || newTaskMessage === ''){
                newTaskMessage = taskFound.taskMessage;
            }

            taskFound.taskMessage = newTaskMessage;

            tasks.splice(taskIndex, 1, taskFound);

            setStorage('tasks', tasks);
            displayTasks();
        }

        const editStatusTask = (id, status) => {
            let tasks = getStorage('tasks') || [];

            const taskIndex = tasks.findIndex(task => task.id === id);
            const taskFound = tasks.find(task => task.id === id);

            if(status === true) {
                taskFound.status = "completed";
            } else {
                taskFound.status = "not completed";
            }

            tasks.splice(taskIndex, 1, taskFound);
            setStorage('tasks', tasks);
            displayTasks();
        }
            
        displayTasks();
        
    }
}())