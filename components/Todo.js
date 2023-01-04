export class Todo
{
    constructor({ inputField, addBtn, listContainer, saveBtn, deleteBtn })
    {
        if (
            inputField === undefined ||
            addBtn === undefined ||
            listContainer === undefined ||
            saveBtn === undefined ||
            deleteBtn === undefined
        ) {
            alert('E, neće moći ove noći!!!!');
            return;
        }
        this.inputField = inputField != null ? document.querySelector(`#${inputField}`) : null;

        this.addBtn = addBtn != null ? document.querySelector(`#${addBtn}`) : null;

        this.listContainer = listContainer != null ? document.querySelector(`#${listContainer}`) : null;

        this.saveBtn = saveBtn != null ? document.querySelector(`#${saveBtn}`) : null;

        this.deleteBtn = deleteBtn != null ? document.querySelector(`#${deleteBtn}`) : null;

        this.storageKey = 'tasks';
    }

    // Inicijalizacija aplikacije
    init = () => {
        this.createList();
        this.checkStorage();
        this.addListeners();
    }

    // Provjeri da li ima spremljena lista u lokalnoj pohrani. Ako ima, rekonstruiraj je.
    checkStorage = () => {
        if (window.localStorage === undefined) {
            alert('Tvoj preglednik ne podržava lokalnu pohranu!');
            return;
        }

        const data = localStorage.getItem(this.storageKey);

        if (data != null) {
            const tasks = JSON.parse(atob(data));
            
            for (const task of tasks) {
                const item = this.createTaskItem(task.title);
                item.dataset.createdAt = task.createdAt;

                if (task.done) {
                    item.classList.add('done');
                    item.querySelector('[type="checkbox"]').checked = true;
                    item.dataset.doneAt = task.doneAt;
                }
                

                this.ul.append(item);
            }
        }
    }

    // Kreiraj novu listu i umetni ju u kontejner
    createList = () => {
        this.ul = document.createElement('ul');
        this.ul.classList.add('todo-list');
        this.listContainer.append(this.ul);
    }

    // Dodavanje event listener-a
    addListeners = () => {
        if (this.addBtn != null) {
            this.addBtn.addEventListener('click', this.addNewTask);
        }

        this.inputField.addEventListener('keyup', this.pressEnter);
        this.saveBtn.addEventListener('click', this.saveList);
        this.deleteBtn.addEventListener('click', this.deleteList);
    }

    // Spremanje liste taskova u lokalnu pohranu
    saveList = (e) => {
        e.preventDefault();

        if (window.localStorage === undefined) {
            alert('Tvoj preglednik ne podržava lokalnu pohranu!');
            return;
        }

        const items = this.ul.querySelectorAll('li');

        if (items.length > 0) {
            const tasks = [];

            for (const item of items) {
                tasks.push({
                    title: item.innerText.slice(0, -1),
                    done: item.classList.contains('done'),
                    createdAt: item.dataset.createdAt,
                    doneAt: item.dataset.doneAt ? item.dataset.doneAt : null
                });
            }

            localStorage.setItem(this.storageKey, btoa(JSON.stringify(tasks)));

            return;
        }

        alert('Nisi upisao niti jedan task!');
    }

       //Brisanje liste taskova iz lokalne pohrane i DOM-a
    deleteList = (e) => {
        e.preventDefault();

        if(!confirm("Jesi li ziher da želiš obrisati listu zadataka?")) return;
        if (window.localStorage == undefined) {
            console.error("Tvoj preglednik ne podržava lokalnu pohranu")
        }

        //this.ul.innerHTML = "";
        this.ul.remove();
        this.createList();
        localStorage.removeItem(this.storageKey)
    }
  

   
 

    // Dodavanje novog taska pritiskom na tipku enter
    pressEnter = (e) => {

        if (e.key === "Enter") {
            this.addNewTask(e);
        }
    }

    // Dodavanje novog taska
    addNewTask = (e) =>{
        e.preventDefault();

        const task = this.inputField.value.trim();

        if (!task) {
            alert('Upiši task!');
            this.resetInput();
            return;
        }

        const item = this.createTaskItem(task);

        this.ul.append(item);

        this.resetInput();
    }

    // Kreiranje novog elementa liste kao novi task
    createTaskItem = (task) => {
        const item = document.createElement('li');
        item.innerText = task;
        item.dataset.createdAt = this.createTimestamp('hr');

        this.addCheckbox(item);
        this.addRemoveTaskBtn(item);
        
        return item;
    }

    // Dodaj gumb za brisanje pojedinog taska u li element
    addRemoveTaskBtn = (item) => {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.innerText = 'x';
        btn.addEventListener('click', this.removeItem);

        item.append(btn);
       
    }
       
    // Izbriši task iz liste
    removeItem = (e) => {
        const btn = e.target;
        const item = btn.parentNode;

        if (item.classList.contains('done')) {
            alert('Nema brisanja');
            return;
        }

        item.remove();
    }

    // Dodaj checkbox u li element
    addCheckbox = (item) => {
        const cb = document.createElement('input');
        cb.setAttribute('type', 'checkbox');
        cb.addEventListener('change', this.markDone);

        item.prepend(cb);
    }

    // Označi task rješenim / ne rješenim
    markDone = (e) => {
        const cb = e.target;
        const item = cb.parentNode;

        item.classList.toggle('done');

        if (cb.checked) {
            item.dataset.doneAt = this.createTimestamp('hr');
        } else {
            item.dataset.doneAt = '';
        }
        
    }
  
    // Izbrši sadržaj input polja i postavi fokus na njega
    resetInput = () => {
        this.inputField.value = '';
        this.inputField.focus();
    }

    // Kreiraj timestamp
    createTimestamp = (locale) => {
        const date = new Date();
        const localeDate = date.toLocaleDateString(locale);
        const localeTime = date.toLocaleTimeString(locale);

        return `${localeDate} ${localeTime}`;
    }
}