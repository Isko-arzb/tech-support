const form = document.getElementById("supportForm");
const requestsContainer = document.getElementById("requests");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");
const filter = document.getElementById("filter");

let requestNumber = 0;
let requests = [];

// Загрузка сохранённых заявок из браузера (localStorage)
try {
    const saved = JSON.parse(localStorage.getItem("supportRequests"));
    if (Array.isArray(saved)) {
        requests = saved;
        requests.forEach(function(request) {
            if (request.number > requestNumber) {
                requestNumber = request.number;
            }
        });
    }
} catch (e) {
    requests = [];
}

function saveRequests() {
    try {
        localStorage.setItem("supportRequests", JSON.stringify(requests));
    } catch (e) {
        // если хранилище недоступно — просто работаем без сохранения
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const room = document.getElementById("room").value.trim();
    const email = document.getElementById("email").value.trim();
    const category = document.getElementById("category").value;
    const priority = document.getElementById("priority").value;
    const description = document.getElementById("description").value.trim();

    if (name === "" || room === "" || email === "") {
        alert("Пожалуйста, заполните все обязательные поля.");
        return;
    }

    if (!email.includes("@")) {
        alert("Введите правильный Email.");
        return;
    }

    if (description.length < 10) {
        alert("Описание проблемы должно содержать минимум 10 символов.");
        return;
    }

    requestNumber++;

    const request = {
        number: requestNumber,
        name: name,
        room: room,
        email: email,
        category: category,
        priority: priority,
        description: description,
        status: "Новая",
        date: new Date().toLocaleString()
    };

    requests.push(request);
    saveRequests();
    applyFilter();
    form.reset();
});

function displayRequests(list) {
    requestsContainer.innerHTML = "";

    if (list.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = requests.length === 0 ? "Заявок пока нет." : "Ничего не найдено.";
        requestsContainer.appendChild(empty);
        return;
    }

    list.forEach(function(request) {
        const card = document.createElement("div");
        card.className = "request-card";
        if (request.status === "Выполнено") {
            card.className += " done";
        }

        const title = document.createElement("h3");
        title.textContent = "Заявка №" + request.number;

        const user = document.createElement("p");
        user.textContent = "Пользователь: " + request.name;

        const room = document.createElement("p");
        room.textContent = "Кабинет: " + request.room;

        const email = document.createElement("p");
        email.textContent = "Email: " + request.email;

        const category = document.createElement("p");
        category.textContent = "Категория: " + request.category;

        const priority = document.createElement("p");
        priority.textContent = "Приоритет: " + request.priority;

        const description = document.createElement("p");
        description.textContent = "Описание: " + request.description;

        const date = document.createElement("p");
        date.textContent = "Создано: " + request.date;

        const status = document.createElement("p");
        status.textContent = "Статус: " + request.status;

        const doneButton = document.createElement("button");
        doneButton.textContent = "Выполнено";
        doneButton.addEventListener("click", function() {
            request.status = "Выполнено";
            saveRequests();
            applyFilter();
        });

        card.appendChild(title);
        card.appendChild(user);
        card.appendChild(room);
        card.appendChild(email);
        card.appendChild(category);
        card.appendChild(priority);
        card.appendChild(description);
        card.appendChild(date);
        card.appendChild(status);

        if (request.status === "Новая") {
            card.appendChild(doneButton);
        }

        requestsContainer.appendChild(card);
    });
}

searchButton.addEventListener("click", function() {
    applyFilter();
});

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        applyFilter();
    }
});

filter.addEventListener("change", function() {
    applyFilter();
});

function applyFilter() {
    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = filter.value;

    const result = requests.filter(function(request) {
        const matchesSearch =
            request.name.toLowerCase().includes(searchText) ||
            request.category.toLowerCase().includes(searchText) ||
            request.description.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "Все" ||
            request.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    displayRequests(result);
}

applyFilter();
