console.log("coucou");

//1. initialiser le localstorage
//tasks -> []
localStorage.setItem("tasks", JSON.stringify(tasks));

// -> ce qu'il a dans le localstorage.tasks
//on va mettre 2 tasks au départ dedans:
//[ {id:1, content:"Tâche 1", completed: true},
//{id:1, content:"Tâche 1", completed: true}]
// localStorage.setItem("tasks", JSON.stringify(tasks));

//json.stringify (chaine de carac) le contraire c'est parse

if (localStorage.tasks === undefined) {
  localStorage.tasks = JSON.stringify([]);
}

// 2. Afficher les tasks dans le DOM
const ul = document.querySelector(".todo-list");

const tasks = JSON.parse(localStorage.tasks);

tasks.forEach((task) => {
  const li = document.createElement("li");
  if (task.completed) {
    li.classList.add("completed");
  }
  li.innerHTML = `
        <div class="view">
            <input class="toggle" type="checkbox" ${
              task.completed ? "checked" : ""
            } />
            <label>${task.content}</label>
            <button class="destroy"></button>
        </div>`;
  ul.appendChild(li);
});
