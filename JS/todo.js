// ===== SELECTING ELEMENTS FROM THE HTML =====
const taskInput = document.getElementById('task-input')
const addBtn = document.getElementById('add-btn')
const taskList = document.getElementById('task-list')
const tasksLeft = document.querySelector('.tasks-left')
const filters = document.querySelectorAll('.filter')

// ===== TASK ARRAY — stores all tasks =====
let tasks = []

// ===== ADD TASK FUNCTION =====
function addTask() {

  // Read what the user typed
  const taskText = taskInput.value.trim()

  // If input is empty do nothing
  if (taskText === '') {
    alert('Please type a task first')
    return
  }

  // Create a new task object
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  }

  // Add the new task to the tasks array
  tasks.push(newTask)

  // Clear the input field
  taskInput.value = ''

  // Render the updated task list
  renderTasks()
}

// ===== RENDER TASKS FUNCTION =====
function renderTasks(filter = 'all') {

  // Clear the current list
  taskList.innerHTML = ''

  // Filter tasks based on selected filter
  let filteredTasks = tasks

  if (filter === 'active') {
    filteredTasks = tasks.filter(task => !task.completed)
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed)
  }

  // Loop through tasks and create HTML for each one
  filteredTasks.forEach(task => {

    const li = document.createElement('li')
    li.classList.add('task-item')

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} />
      <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
      <div class="task-actions">
        <i class="fa-regular fa-pen-to-square edit-btn" data-id="${task.id}"></i>
        <i class="fa-regular fa-trash-can delete-btn" data-id="${task.id}"></i>
      </div>
    `

    // CHECKBOX — toggle completed
    const checkbox = li.querySelector('.task-checkbox')
    checkbox.addEventListener('click', () => toggleTask(task.id))

    // DELETE BUTTON
    const deleteBtn = li.querySelector('.delete-btn')
    deleteBtn.addEventListener('click', () => deleteTask(task.id))

    // EDIT BUTTON
    const editBtn = li.querySelector('.edit-btn')
    editBtn.addEventListener('click', () => editTask(task.id))

    taskList.appendChild(li)
  })

  // Update tasks left count
  updateTasksLeft()
}

// ===== TOGGLE TASK COMPLETED =====
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed }
    }
    return task
  })
  renderTasks(currentFilter)
}

// ===== DELETE TASK =====
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id)
  renderTasks(currentFilter)
}

// ===== EDIT TASK =====
function editTask(id) {
  const task = tasks.find(task => task.id === id)
  const newText = prompt('Edit your task:', task.text)

  if (newText !== null && newText.trim() !== '') {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, text: newText.trim() }
      }
      return task
    })
    renderTasks(currentFilter)
  }
}

// ===== UPDATE TASKS LEFT COUNT =====
function updateTasksLeft() {
  const remaining = tasks.filter(task => !task.completed).length
  tasksLeft.textContent = `${remaining} tasks left`
}

// ===== FILTER TASKS =====
let currentFilter = 'all'

filters.forEach(filter => {
  filter.addEventListener('click', (e) => {
    e.preventDefault()

    // Remove active class from all filters
    filters.forEach(f => f.classList.remove('active-filter'))

    // Add active class to clicked filter
    filter.classList.add('active-filter')

    // Set current filter
    currentFilter = filter.textContent.toLowerCase()

    // Render with new filter
    renderTasks(currentFilter)
  })
})

// ===== ADD BUTTON CLICK =====
addBtn.addEventListener('click', addTask)

// ===== PRESS ENTER TO ADD TASK =====
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask()
  }
})