// Ambil data dari localStorage atau buat array kosong
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString("id-ID", options);
}

// Render todo ke layar
function renderTodos() {
    const list = document.getElementById("todoList");
    list.innerHTML = "";

    const filter = document.getElementById("filter").value;
    const sort = document.getElementById("sort").value;
    const now = new Date();

    // Filter
    let filteredTodos = todos.filter(todo => {
        if (filter === "all") return true;
        if (filter === "low" || filter === "medium" || filter === "high") {
            return todo.priority === filter;
        }
        if (filter === "overdue") {
            return new Date(todo.dueDate) < now;
        }
        if (filter === "upcoming") {
            return new Date(todo.dueDate) >= now;
        }
        return true;
    });

    // Sort
    if (sort === "asc") {
        filteredTodos.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (sort === "desc") {
        filteredTodos.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }

    // Group todos berdasarkan tanggal
    const groups = {};
    filteredTodos.forEach(todo => {
        const groupKey = todo.dueDate;
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(todo);
    });

    // Render grouped list
    Object.keys(groups).sort((a, b) => new Date(a) - new Date(b)).forEach(dateKey => {
        // Group header / judul tanggal
        const groupHeader = document.createElement("li");
        groupHeader.innerHTML = `<div class="group-header text-slate-600 font-bold text-sm my-2">${formatDate(dateKey)} </div>`;
        list.appendChild(groupHeader);

        groups[dateKey].forEach((todo, index) => {
            const li = document.createElement("li");
            const isOverdue = new Date(todo.dueDate) < now;

            li.innerHTML = `
              <div class="info flex m-0 justify-between items-center w-full border ${isOverdue ? 'border-red-500' : 'border-green-500'} p-3 rounded shadow-sm hover:shadow-md transition-all delay-150">
                <div class="flex-1">
                  <strong>${todo.text}</strong><br>
                  <small class="text-xs text-slate-500">${formatDate(todo.createdAt)}</small><br>
                </div>
                <div class="flex min-w-10 gap-2 items-start justify-start">
                  <div class="flex flex-col items-end gap-1">
                <small class="${isOverdue ? 'overdue' : 'text-green-500'}">
                ${formatDate(todo.dueDate)}
                </small>
                <small class="priority-${todo.priority} text-xs flex items-end text-right gap-2">
                  <span class="priority-${todo.priority} font-bold">${todo.priority.toUpperCase()}</span>
                </small>
                  </div>
                  <button class="flex justify-center items-center text-red-400 cursor-pointer hover:text-white hover:bg-red-500 rounded-lg transition-all delay-150" onclick="deleteTodo(${todos.indexOf(todo)})">
                <span class="material-symbols-outlined" style="font-size:32px;">delete</span>
                  </button>
                </div>
              </div>
            `;

            list.appendChild(li);
        });
    });
}

// Tambah todo
function addTodo() {
    const input = document.getElementById("todoInput");
    const date = document.getElementById("todoDate");
    const priority = document.getElementById("todoPriority");

    if (input.value.trim() === "" || date.value === "") {
        alert("Harap isi todo dan tanggal deadline!");
        return;
    }

    const newTodo = {
        text: input.value,
        createdAt: new Date().toISOString(),
        dueDate: date.value,
        priority: priority.value
    };

    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));

    input.value = "";
    date.value = "";
    priority.value = "low";

    renderTodos();
}

// Hapus todo
function deleteTodo(index) {
    if (confirm("Apakah Anda yakin ingin menghapus todo ini?")) {
        todos.splice(index, 1);
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodos();
    }
}

renderTodos();