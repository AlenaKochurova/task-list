let taskTitle = document.getElementById('taskTitle')
let taskText = document.getElementById('taskText')
let taskPriority = document.getElementById('taskPriority')
let activeTasks = document.getElementById('activeTasks')
let completedTasks = document.getElementById('completedTasks')
let addTaskBtn = document.getElementById('addTaskBtn')
let taskDeadline = document.getElementById("taskDeadline");

let tasks = []
let currentPriority = "все";

let saved = localStorage.getItem("tasks")
if (saved){
  tasks = JSON.parse(saved);
  displayTasks();
}

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks))}

addTaskBtn.addEventListener("click", function(){
    
    let task = {
    title: taskTitle.value,
    text: taskText.value,
    priority: taskPriority.value,
    deadline: taskDeadline.value,
    date: new Date(),
    completed: false
    }

    tasks.push(task)
    taskTitle.value = ""
    taskText.value = ""
    displayTasks()
    saveTasks()
})

function displayTasks (){
    
    let tasksToShow = []

    if (currentPriority === "все"){
        tasksToShow = tasks
    } else {
        tasksToShow = tasks.filter(function(task){
           return task.priority === currentPriority
        })
    }
    
    document.getElementById("activeTasks").innerHTML = "";
    document.getElementById("completedTasks").innerHTML = "";
    
    for (let i = 0; i < tasksToShow.length; i++){

        let currentTask = tasksToShow[i];
        
        let taskBlock = document.createElement("div")
        taskBlock.classList.add("task-block")

        let now = new Date();

        // Проверяем, есть ли дедлайн и уже ли он прошёл
        if (currentTask.deadline) {
          let deadlineDate = new Date(currentTask.deadline);
          if (deadlineDate < now) {
            taskBlock.classList.add("task-overdue");
          }
        }
        
        let taskTitleElement = document.createElement("h3")
        taskTitleElement.innerText = currentTask.title

        let checkMark = document.createElement("span");
        checkMark.classList.add("checkmark");

        if (currentTask.completed) {
          checkMark.innerText = "Выполненно: ✅";
          } else {
          checkMark.innerText = "Ожидает выполнения: 🔲";
        }

        // Добавляем клик по галочке
        checkMark.addEventListener("click", function () {
          currentTask.completed = !currentTask.completed;
          saveTasks();
          displayTasks();
        });

        // Вставим галочку перед заголовком
        taskBlock.appendChild(checkMark);
        taskBlock.appendChild(taskTitleElement);


        let taskTextElement = document.createElement("p")
        taskTextElement.innerText = currentTask.text

        let editBtn = document.createElement("button")
        editBtn.innerText = "✏️ Редактировать"

        let deleteTaskBtn = document.createElement("button")
        deleteTaskBtn.innerText = "🗑 Удалить"

        let priorityTask = document.createElement("small")
        priorityTask.classList.add("task-priority", `priority-${currentTask.priority.toLowerCase()}`)
        priorityTask.innerText = currentTask.priority

        if (currentTask.deadline) {
          let deadlineDate = new Date(currentTask.deadline);

          let deadlineEl = document.createElement("small");
          deadlineEl.classList.add("task-deadline");

          // Форматируем дату красиво
          let day = deadlineDate.getDate();
          let monthNames = [
          "января", "февраля", "марта", "апреля",
          "мая", "июня", "июля", "августа",
          "сентября", "октября", "ноября", "декабря"
          ];
          let month = monthNames[deadlineDate.getMonth()];
          let year = deadlineDate.getFullYear();
          let hours = String(deadlineDate.getHours()).padStart(2, "0");
          let minutes = String(deadlineDate.getMinutes()).padStart(2, "0");

          deadlineEl.innerText = `⏰ Дедлайн: ${day} ${month} ${year}, ${hours}:${minutes}`;
          taskBlock.appendChild(deadlineEl);
        }

        
        let dateEl = document.createElement("small");
        dateEl.classList.add("note-date"); 

        let createdDate = new Date(currentTask.date); 

        let monthNames = [
        "января", "февраля", "марта", "апреля",
        "мая", "июня", "июля", "августа",
        "сентября", "октября", "ноября", "декабря"
        ];

        let day = createdDate.getDate();
        let month = monthNames[createdDate.getMonth()];
        let year = createdDate.getFullYear();
        let hours = createdDate.getHours().toString().padStart(2, "0");
        let minutes = createdDate.getMinutes().toString().padStart(2, "0");

        dateEl.innerText = `Создано: ${day} ${month} ${year}, ${hours}:${minutes}`;

        if (currentTask.completed) {
          document.getElementById("completedTasks").appendChild(taskBlock);
          } else {
          document.getElementById("activeTasks").appendChild(taskBlock);
        }

        taskBlock.appendChild(priorityTask)
        taskBlock.appendChild(taskTitleElement)
        taskBlock.appendChild(taskTextElement)
        taskBlock.appendChild(editBtn)
        taskBlock.appendChild(deleteTaskBtn)
        taskBlock.appendChild(dateEl)

        editBtn.addEventListener("click", function(){

          let newTitle = prompt("Введите новый заголовок", tasksToShow[i].title)
          let newText = prompt("Введите обновлённую задачу", tasksToShow[i].text)

          if (newText && newTitle){
            currentTask.title = newTitle
            currentTask.text = newText
            displayTasks()
            saveTasks()
            }
        })

        deleteTaskBtn.addEventListener("click", function(){
          let index = tasks.indexOf(currentTask)
          if (index !== -1){
            tasks.splice(index, 1)
            displayTasks()
            saveTasks()
          }
        })
    }
}
let filterButtons = document.querySelectorAll("#priorityFilters button");

filterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    currentPriority = button.dataset.priority;

    // Удаляем активные классы и возвращаем обычный текст
    filterButtons.forEach(btn => {
      btn.classList.remove("active");
      btn.innerText = btn.dataset.priority; // очищаем анимацию кнопок
    });

    // Добавляем активной кнопке класс и анимацию
    button.classList.add("active");
    button.innerHTML = `
      ${button.dataset.priority}
      <span class="spinner"></span>
    `;

    displayTasks();
  });
});



/*let task2 = {
  title: "Написать отчёт",
  priority: "высокий",
  assignedTo: {
    name: "Алёна",
    email: "alena@example.com"
  }
};

function printObject(obj) {
  for (let key in obj) {
    let value = obj[key];
    if (typeof value === "object" && value !== null) {
      console.log(`Ключ: ${key} | Значение: объект`);
      // Вызываем функцию снова, чтобы показать вложенные свойства
      printObject(value);
    } else {
      console.log(`Ключ: ${key} | Значение: ${value}`);
    }
  }
}


let user = {
  title:"задача",
  assignedTo: {
  name: "Алёна",
  age: "29",
  contact: {
    phone: 9630518564,
    email: "alena@example.com"
  }
}}

function printUser(object){
  for (let key in object) {
    let value = object[key]
    if (typeof value === "object" && value !== null){
      console.log(`Ключ: ${key} | Значение: объект`)
      printUser(value)
    } else {
      console.log(`Ключ: ${key} | Значение: ${value}`);

    }
  }
}

printUser(user)


/*function showTaskInfo({ title, priority, assignedTo }) {
  console.log(`Задача: ${title}, приоритет: ${priority}, назначена: ${assignedTo.name} (${assignedTo.email})`)
  
}

showTaskInfo(task2)*/

/*function makePhraseBook(phrases){
 return function(key){
if (key in phrases){
  return phrases[key]
} else {
 return"фраза не найдена"
}
}
};

let phrases = {
  доброе_утро: "Good morning",
  спокойной_ночи: "Good night"
}
let phraseBook = makePhraseBook(phrases);
console.log(phraseBook("доброе_утро")); // "Good morning"
console.log(phraseBook("спокойной_ночи")); // "Good night"
console.log(phraseBook("пока")); // "Фраза не найдена"

function createPromo(code, discount) {
  return function(userCode, price) {
  if(code === userCode) {
    alert(`Скидка: ${discount}, Итого: ${price-discount}`)
  } else {
    alert("Промокод недействителен")
  }
  }}

  let applyPromo = createPromo("SAVE10", 10);

applyPromo("SAVE10", 1000);  
applyPromo("HELLO", 1000);   */
