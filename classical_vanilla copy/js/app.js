/* // Je remplis artificiellement le localStorage.tasks
// localStorage.tasks = JSON.stringify([
//     {id: 1, content: "Tâche 1", completed: true},
//     {id: 2, content: "Tâche 2", completed: false}
// ]);

// {id:xxx, content: 'xx', completed:xxx}
function getTaskDomElement(task) {
  const li = document.createElement("li");
  //ajouter un id
  li.dataset.id = task.id;
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
  return li;
}

// 1. Initialiser le localstorage
// tasks -> []
if (localStorage.tasks === undefined) {
  localStorage.tasks = JSON.stringify([]);
}

// 2. Afficher les tasks dans le DOM
const ul = document.querySelector(".todo-list");
const tasks = JSON.parse(localStorage.tasks);
tasks.forEach((task) => {
  ul.appendChild(getTaskDomElement(task));
});

// Appel initial pour afficher le nombre de tâches restantes au chargement de la page
updateTaskCount();

// AJOUT D'UNE TÂCHE ------------------------------------------
// Keyup, enter et que le champ n'est pas vide
// Créer un li et l'ajouter dans le UL
// Il va falloir mettre à jour le tableau tasks et le localStorage

document.querySelector(".new-todo").addEventListener("keyup", function (e) {
  if (e.key === "Enter" && this.value != "") {
    // 1. Ajouter un li dans le ul (insertBefore)
    const newTask = {
      id: new Date().valueOf(),
      content: this.value,
      completed: false,
    };
    ul.insertBefore(getTaskDomElement(newTask), ul.firstChild);

    // 2. Ajouter la tâche dans tasks (push)
    //    Pour l'id, on va utiliser new Date().valueOf();
    //    La structure d'une tâche: {id: xxx, content: 'xxx', completed: false}
    tasks.unshift(newTask);

    // 3. Ecraser le localStorage.tasks avec les tasks
    //localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.tasks = JSON.stringify(tasks);

    // 4. Vider le champs
    this.value = "";
  }
});

// TERMINER UNE TÂCHE ------------------------------------------
// Quand on change le checkbox
// 1. On ajoute ou on supprime la classe 'completed' sur le li correspondant
// 2. On Modifie la task dans le tasks (true/false)
// 3. on écrase le localStorage.tasks

/* fonction flaché = on  a besoin d'utiliser thise */

/* ul.addEventListener("change", function (e) {
  if (e.target.classList.contains("toggle")) {
    const li = e.target.closest("li");
    const taskId = parseInt(li.dataset.id, 10);
    const task = tasks.find((t) => t.id === taskId);

    // 1. Ajouter ou supprimer la classe 'completed' sur le li correspondant
    li.classList.toggle("completed");

    // 2. Modifier la tâche dans tasks (true/false)
    task.completed = !task.completed;

    // 3. Ecraser le localStorage.tasks avec les tasks
    localStorage.tasks = JSON.stringify(tasks);
  }
}); */

/* const checkboxes = document.querySelectorAll(".toggle");

checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener("change", function (e) {
    const li = this.closest("li");
    const taskId = parseInt(li.dataset.id, 10);

    tasks.forEach(function (task) {
      if (task.id === taskId) {
        task.completed = e.target.checked;
      }
    });

    li.classList.toggle("completed");
    // 3. Ecraser le localStorage.tasks avec les tasks
    localStorage.tasks = JSON.stringify(tasks);
  });
}); 

// ATTENTION: ne vous souciez que des tasks présentes au départ

// Capture par sélection
// document.querySelectorAll(".toggle").forEach(trigger => {
//     trigger.addEventListener('change', function() {
//         this.closest('li').classList.toggle("completed");
//     })
// });

// Capture par délégation
document.addEventListener("change", (e) => {
  if (e.target.matches(".toggle")) {
    e.target.closest("li").classList.toggle("completed");
    // on récupère l'id dans le li
    const id = e.target.closest("li").dataset.id;
    //on récupère dans la tab tasks la task qui correspond à l'id
    const task = tasks.find((task) => task.id === Number(id));
    //on modifie son completed
    task.completed = !task.completed;
    // 3. Ecraser le localStorage.tasks avec les tasks
    localStorage.tasks = JSON.stringify(tasks);
    //4. Mise à jour du compteur de tâches restantes
    updateTaskCount();
  }
});

// SUPPRESSION D'UNE TÂCHE ------------------------------------------
// Quand on clique sur le bouton de suppression
// 1. On supprime le li correspondant du DOM
// 2. On supprime la tâche du tableau tasks
// 3. On écrase le localStorage.tasks

// Capture par délégation
document.addEventListener("click", (e) => {
  if (e.target.matches(".destroy")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;

    // 1. Supprimer le li du DOM
    ul.removeChild(li);

    // 2. Supprimer la tâche du tableau tasks
    tasks = tasks.filter((task) => task.id !== Number(id));

    // 3. Écraser le localStorage.tasks
    localStorage.tasks = JSON.stringify(tasks);

    // Mise à jour du compteur de tâches restantes
    updateTaskCount();
  }
});

// Mise à jour du compteur de tâches restantes
function updateTaskCount() {
  const taskCount = tasks.filter((task) => !task.completed).length;
  const taskCountElement = document.querySelector(".todo-count span");
  taskCountElement.textContent = taskCount;
}

/*  Défi 2 - Modifier une tâche
  placer le texte de la tâche dans un input quand on double-clique sur ce texte
  modifier le texte de la tâche dans le DOM quand on appuie sur Enter 
  Modifier le tableau et mettre à jour le localStorage 

// Gestionnaire d'événements pour le double-clic sur le texte de la tâche
//e.target.closest("ul") !== null (pas besoin de faire doc pour n'est pas vérfier si lable dans ul )
ul.addEventListener("dblclick", function (e) {
  if (e.target.tagName === "LABEL") {
    //e.target.classList.contains("label") nodeName MJ, localName Mi
    const li = e.target.closest("li");
    li.classList.add("editing");
    li.innerHTML += `<input class="edit" value="${e.target.textContent}">`;
    li.querySelector(".edit").focus(); // or .select()
  }
});

// Gestionnaire d'événements pour la touche "Enter" lors de la modification d'une tâche
ul.addEventListener("keyup", function (e) {
  if (e.key === "Enter" && e.target.classList.contains("edit")) {
    const li = e.target.closest("li");
    const label = li.querySelector("label");
    const id = li.dataset.id;
    const task = tasks.find((task) => task.id === Number(id));
    task.content = e.target.value;
    label.textContent = e.target.value;
    li.removeChild(e.target);
    li.classList.remove("editing");
    localStorage.tasks = JSON.stringify(tasks);
  }
});

// Mettre à jour la fonction getTaskDomElement avec une classe "editing" pour la modification d'une tâche
function getTaskDomElement(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  if (task.completed) {
    li.classList.add("completed");
  }
  if (task.editing) {
    li.classList.add("editing");
  }
  li.innerHTML = `
      <div class="view">
          <input class="toggle" type="checkbox" ${
            task.completed ? "checked" : ""
          } />
          <label>${task.content}</label>
          <button class="destroy"></button>
      </div>`;
  return li;
}

// Mettre à jour le gestionnaire d'événements pour la modification d'une tâche lors de la création d'une nouvelle tâche
document.querySelector(".new-todo").addEventListener("keyup", function (e) {
  if (e.key === "Enter" && this.value !== "") {
    const newTask = {
      id: new Date().valueOf(),
      content: this.value,
      completed: false,
      editing: false, // Ajouter la propriété "editing" à la nouvelle tâche
    };
    ul.appendChild(getTaskDomElement(newTask));
    tasks.push(newTask);
    localStorage.tasks = JSON.stringify(tasks);
    updateTaskCount();
    this.value = "";
  }
});
 */

// Je remplis artificiellement le localStorage.tasks
// localStorage.tasks = JSON.stringify([
//     {id: 1, content: "Tâche 1", completed: true},
//     {id: 2, content: "Tâche 2", completed: false}
// ]);

function getTaskDomElement(task) {
  const li = document.createElement("li");
  // J'ajoute le data-id avec l'id de la tâche
  li.dataset.id = task.id;
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
  return li;
}

// 1. Initialiser le localStorage
// tasks -> []
if (localStorage.tasks === undefined) {
  localStorage.tasks = JSON.stringify([]);
}

// 2. Afficher les tâches dans le DOM
const ul = document.querySelector(".todo-list");

let tasks = JSON.parse(localStorage.tasks);
tasks.forEach((task) => {
  ul.appendChild(getTaskDomElement(task));
});

// Mise à jour du compteur de tâches restantes
function updateTaskCount() {
  const taskCount = tasks.filter((task) => !task.completed).length;
  const taskCountElement = document.querySelector(".todo-count span");
  taskCountElement.textContent = taskCount;
}

// Appel initial pour afficher le nombre de tâches restantes au chargement de la page
updateTaskCount();

// AJOUT D'UNE TÂCHE ------------------------------------------
// Keyup, enter et que le champ n'est pas vide
// Créer un li et l'ajouter dans le UL
// Il va falloir mettre à jour le tableau tasks et le localStorage
document.querySelector(".new-todo").addEventListener("keyup", function (e) {
  if (e.key === "Enter" && this.value !== "") {
    // 1. Créer un objet littéral
    const newTask = {
      id: new Date().valueOf(),
      content: this.value,
      completed: false,
    };

    // 2. Ajouter un li dans le ul (appendChild)
    ul.appendChild(getTaskDomElement(newTask));

    // 3. Ajouter la tâche dans tasks (push)
    tasks.push(newTask);

    // 4. Écraser le localStorage.tasks avec les tasks
    localStorage.tasks = JSON.stringify(tasks);

    // Mise à jour du compteur de tâches restantes
    updateTaskCount();

    // 5. Vider le champ
    this.value = "";
  }
});

// TERMINER UNE TÂCHE ------------------------------------------
// Quand on change le checkbox
// 1. On ajoute ou on supprime la classe 'completed' sur le li correspondant (toggle)
// 2. On modifie la tâche dans tasks (true/false)
// 3. On écrase le localStorage.tasks

// Capture par délégation
document.addEventListener("change", (e) => {
  if (e.target.matches(".toggle")) {
    e.target.closest("li").classList.toggle("completed");
    // On récupère l'id dans le li
    const id = e.target.closest("li").dataset.id;

    // On récupère dans le tableau tasks la tâche qui correspond à l'id
    const task = tasks.find((task) => task.id === Number(id));
    task.completed = !task.completed;

    // J'écrase le localStorage.tasks
    localStorage.tasks = JSON.stringify(tasks);

    // Mise à jour du compteur de tâches restantes
    updateTaskCount();
  }
});

// SUPPRESSION D'UNE TÂCHE ------------------------------------------
// Quand on clique sur le bouton de suppression
// 1. On supprime le li correspondant du DOM
// 2. On supprime la tâche du tableau tasks
// 3. On écrase le localStorage.tasks

// Capture par délégation
document.addEventListener("click", (e) => {
  if (e.target.matches(".destroy")) {
    const li = e.target.closest("li");
    const id = li.dataset.id;

    // 1. Supprimer le li du DOM
    ul.removeChild(li);

    // 2. Supprimer la tâche du tableau tasks
    tasks = tasks.filter((task) => task.id !== Number(id));

    // 3. Écraser le localStorage.tasks
    localStorage.tasks = JSON.stringify(tasks);

    // Mise à jour du compteur de tâches restantes
    updateTaskCount();
  }
});

// FILTRAGE DES TÂCHES ------------------------------------------
// Lorsqu'on clique sur l'un des filtres (All, Active, Completed)
// 1. On supprime toutes les tâches du DOM
// 2. On affiche uniquement les tâches correspondant au filtre sélectionné

const filters = document.querySelectorAll(".filters a");
filters.forEach((filter) => {
  filter.addEventListener("click", function (e) {
    e.preventDefault();

    // Supprimer toutes les tâches du DOM
    ul.innerHTML = "";

    const selectedFilter = this.getAttribute("href"); // Récupérer l'attribut href du lien
    let filteredTasks = tasks;

    if (selectedFilter === "#/active") {
      // Filtrer les tâches non terminées
      filteredTasks = tasks.filter((task) => !task.completed);
    } else if (selectedFilter === "#/completed") {
      // Filtrer les tâches terminées
      filteredTasks = tasks.filter((task) => task.completed);
    }

    // Afficher les tâches correspondantes dans le DOM
    filteredTasks.forEach((task) => {
      ul.appendChild(getTaskDomElement(task));
    });
  });
});

// CLEAR COMPLETED ----------------------------------------------
// Lorsqu'on clique sur le bouton Clear completed
// 1. On supprime les tâches terminées du tableau tasks
// 2. On supprime les tâches terminées du DOM
// 3. On écrase le localStorage.tasks
// 4. On met à jour le compteur de tâches restantes

const clearCompletedButton = document.querySelector(".clear-completed");
clearCompletedButton.addEventListener("click", function () {
  // 1. Supprimer les tâches terminées du tableau tasks
  tasks = tasks.filter((task) => !task.completed);

  // 2. Supprimer les tâches terminées du DOM
  document.querySelectorAll(".completed").forEach((task) => task.remove());

  // 3. Écraser le localStorage.tasks
  localStorage.tasks = JSON.stringify(tasks);

  // 4. Mise à jour du compteur de tâches restantes
  updateTaskCount();
});

/*  Défi 2 - Modifier une tâche
  placer le texte de la tâche dans un input quand on double-clique sur ce texte
  modifier le texte de la tâche dans le DOM quand on appuie sur Enter 
  Modifier le tableau et mettre à jour le localStorage */

// Gestionnaire d'événements pour le double-clic sur le texte de la tâche
//e.target.closest("ul") !== null (pas besoin de faire doc pour n'est pas vérfier si lable dans ul )
ul.addEventListener("dblclick", function (e) {
  //trg l'élé dom sur lequel event s'est produit
  // voir  si l'élément sur lequel l'événement s'est produit est une balise "LABEL"
  if (e.target.tagName === "LABEL") {
    //e.target.classList.contains("label") nodeName MJ, localName Mi
    const li = e.target.closest("li"); //child + proche donc find li contenant tasck to change
    li.classList.add("editing");
    li.innerHTML += `<input class="edit" value="${e.target.textContent}">`; //add new input à li
    li.querySelector(".edit").focus(); // or .select()
  }
});

// Gestionnaire d'événements pour la touche "Enter" lors de la modification d'une tâche
ul.addEventListener("keyup", function (e) {
  if (e.key === "Enter" && e.target.classList.contains("edit")) {
    // déclache quand enter
    const li = e.target.closest("li"); //child (li) + proche de input  permet de trouver l'élément "li" contenant la tâche à modifier.
    const label = li.querySelector("label"); // find label dans li (ériquette origine de task)
    const id = li.dataset.id; //représente id de la tâche à modifier data id
    const task = tasks.find((task) => task.id === Number(id)); // find task correspendate àpd id
    task.content = e.target.value; //update content avec val d'input
    label.textContent = e.target.value; //update visuellement contenu textuel
    li.removeChild(e.target); // remove input de li => retirer le champ d'édition du DOM
    li.classList.remove("editing"); //remove class => désactiver le style visuel de modification de la tâche.
    localStorage.tasks = JSON.stringify(tasks);
  }
});

// Mettre à jour la fonction getTaskDomElement avec une classe "editing" pour la modification d'une tâche
/* fonction crée et retourne un élément de liste <li> représentant une tâche, en ajoutant les classes CSS appropriées pour la mise en forme visuelle 
en fonction de l'état de la tâche (terminée, en cours de modification, etc.) 
et en insérant le contenu textuel de la tâche dans l'étiquette. */
function getTaskDomElement(task) {
  const li = document.createElement("li");
  li.dataset.id = task.id;
  if (task.completed) {
    li.classList.add("completed"); //add class css for style visuel
  }
  if (task.editing) {
    //en train de modif
    li.classList.add("editing");
  }
  li.innerHTML = `
      <div class="view">
          <input class="toggle" type="checkbox" ${
            task.completed ? "checked" : ""
          } />
          <label>${task.content}</label>
          <button class="destroy"></button>
      </div>`;
  return li; //li créé avec tt class css
}

// Mettre à jour le gestionnaire d'événements pour la modification d'une tâche lors de la création d'une nouvelle tâche
document.querySelector(".new-todo").addEventListener("keyup", function (e) {
  if (e.key === "Enter" && this.value !== "") {
    const newTask = {
      id: new Date().valueOf(),
      content: this.value,
      completed: false,
      editing: false, // Ajouter la propriété "editing" à la nouvelle tâche
    };
    ul.appendChild(getTaskDomElement(newTask)); //creat new element de list li
    tasks.push(newTask); // add to table
    localStorage.tasks = JSON.stringify(tasks); //string
    updateTaskCount();
    this.value = ""; //vider
  }
});
