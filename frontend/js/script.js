//-------------------- GLOBAL VARIABLES --------------------

const form = document.getElementById("newTaskForm");
const url = "http://localhost:3000";


//-------------------- HELPER FUNCTIONS --------------------

// Formats the UI layout of each task
function formatTask(task) {
  const tr = document.createElement("tr");
  tr.classList.add("align-middle");
  const isComplete = task.completed;
  const complete = isComplete ? "opacity-50 text-decoration-line-through" : "";
  tr.innerHTML = `
    <th scope="row" class="${complete} text-truncate w-75" style="max-width: 200px;">${task.title}</th>
    <td class="${complete}">${new Date(task.dueDate).toLocaleDateString()}</td>
    <td class="text-end">
      <div class="d-flex justify-content-end">
        ${isComplete ? 
          `<button class="btn btn-icon px-2" onclick="incompleteTask('${task._id}')"><i class="bi bi-x-square text-white"></i></button>`
          :
          `<button class="btn btn-icon px-2" onclick="completeTask('${task._id}')"><i class="bi bi-check-square text-white"></i></button>`
        }
        <button class="btn btn-icon px-2" onclick="openModal('${task._id}', '${task.title}', '${task.dueDate.slice(0, 10)}')"><i class="bi bi-pencil-square text-white"></i></button>
        <button class="btn btn-icon px-2" onclick="deleteTask('${task._id}')"><i class="bi bi-trash text-white"></i></button>
      </div>
    </td>
  `;
  return tr;
}



// Gets all tasks and displays them on the page
async function displayTasks() {
  const tasks = await getTasks();
  const toDoList = document.getElementById("toDoList");

  toDoList.innerHTML = ""; // Clearing the table / Starting fresh

  tasks.forEach(item => {
    toDoList.appendChild(formatTask(item));
  });
}



// Opens the 'Edit' modal with pre populated task info
let editingId = null;
function openModal(id, title, date) {
  editingId = id;
  document.getElementById("editTitle").value = title;
  document.getElementById("editDate").value = date;
  new bootstrap.Modal(document.getElementById("editModal")).show();
}


//---------------- EVENT LISTENERS (TRIGGERS) ----------------

window.addEventListener("DOMContentLoaded", () => {
  displayTasks();
  form.reset();
  document.getElementById("taskFilter").value = ""; // Reset to "All tasks" on page load
  document.getElementById("sortDueDate").checked = false; // unchecks the sort button on page load

  document.getElementById("taskFilter").addEventListener("change", displayTasks);
  document.getElementById("sortDueDate").addEventListener("change", displayTasks);
});


// Submits task form and creates a new task
form.addEventListener("submit", (event) => {
  event.preventDefault();
  createTask();
});


//---------------------- TASK FUNCTIONS / API Calls ----------------------

async function getTasks() {
  try {
    const params = new URLSearchParams();
    const completed = document.getElementById("taskFilter").value;
    if (completed) params.set("completed", completed);
    if (document.getElementById("sortDueDate").checked) params.set("sort", "dueDate");

    const res = await fetch(`${url}/tasks?${params}`); // -> -> ->
    
    if (!res.ok) {
      const err = await res.json();
      return console.error(err.message);
    }

    const data = await res.json(); // <- <- <-
    return data.tasks;

  } catch (error) {
    console.error("Failed to get tasks:", error);
  }
}



async function createTask() {
  try {
    const taskData = {
      title: form.title.value.trim(),
      dueDate: form.dueDate.value
    }

    const res = await fetch(`${url}/tasks/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });

    if (!res.ok) {
      const err = await res.json();
      return console.error(err.message);
    }

    const data = await res.json();
    form.reset();
    displayTasks();
    console.log(data.message, data.task);
    
  } catch (error) {
    console.error("Failed to create a task:", error);
  }
}



async function completeTask(id) {
  try {
    const res = await fetch(`${url}/tasks/complete/${id}`, { method: "PATCH" });

    if (!res.ok) {
      const err = await res.json();
      return console.error(err.message);
    }

    const data = await res.json();
    displayTasks();
    console.log(data.message, data.task);
    
  } catch (error) {
    console.error("Failed to complete task:", error);
  }
}



async function incompleteTask(id) {
  try {
    const res = await fetch(`${url}/tasks/incomplete/${id}`, { method: "PATCH" });

    if (!res.ok) {
      const err = await res.json();
      return console.error(err.message);
    }

    const data = await res.json();
    displayTasks();
    console.log(data.message, data.task);
    
  } catch (error) {
    console.error("Failed to set task to incomplete:", error);
  }
}



async function deleteTask(id) {
  try {
    const res = await fetch(`${url}/tasks/delete/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const err = await res.json();
      return console.error(err.message);
    }

    const data = await res.json();
    displayTasks();
    console.log(data.message, data.task);

  } catch (error) {
    console.error("Failed to delete task!", error);
  }
}



async function editTask() {
  try {
    const taskData = {
      title: document.getElementById("editTitle").value.trim(),
      dueDate: document.getElementById("editDate").value
    }

    const res = await fetch(`${url}/tasks/edit/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData)
    });

    if (!res.ok) {
      const err = await res.json();
      return console.error(err.message);
    }

    const data = await res.json();
    console.log(data.message, data.task);
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    displayTasks();

  } catch (error) { 
    console.error("Failed to edit task:", error);
  }
}