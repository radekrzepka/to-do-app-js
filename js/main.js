const allTasks = [];
class Task {
    constructor(taskName, beginningDate, endDate, isActive) {
        this.taskName = taskName;
        this.beginningDate = beginningDate;
        this.endDate= endDate;
        this.isActive = isActive;
    }
}

const titleInput = document.querySelector(".form--title");
const dateInput = document.querySelector(".form--date");
const warningParagraph = document.querySelector(".form--warning");
const addTaskButton = document.querySelector(".form--button");

const divWithAllTasks = document.querySelector(".tasks");

const downloadDataFromLocalStorage = () => {
    const allTasksLS = JSON.parse(localStorage.getItem("allTasks"));
    allTasksLS.forEach(taskLS => {
        const {taskName, beginningDate, endDate, isActive} = taskLS;
        const task = new Task(taskName, beginningDate, endDate, isActive);
        allTasks.push(task);
    })
}  

const printAllTasks = () => {
    divWithAllTasks.textContent = "";

    for(let i=0; i<allTasks.length; i++) {
        const task = `
            <div class = "task">
                <div class = "task--text">
                    <h3 class = "task--header ${allTasks[i].isActive === false ? "task--header--unactive" : ""}" contenteditable="true"> ${allTasks[i].taskName} </h3>
                    <p class = "task--date ${allTasks[i].isActive === false ? "task--date--unactive" : ""}"> ${allTasks[i].beginningDate} - ${allTasks[i].endDate}</p>
                </div>
                <div class = "task--icons">
                    <img class="task--icon task--confirm-icon" src="./img/confirm icon.png">
                    <img class="task--icon task--bin-icon" src="./img/bin icon.png">
                </div>
            </div>
        `;
        divWithAllTasks.innerHTML += task;
    }
    addEventListenerToDeleteButtons();
    addEventListenerToConfirmButtons();
    addEventListenerToTaskTitle();
}

const sendItemsToLocalStorage = () => {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

const checkCorrectnessOfInputs = (title,endDate) => {
    const todayDateToCheck = new Date().getTime();
    const dateOfEndToCheck = new Date(endDate).getTime();

    if (title === "" || endDate === "" || dateOfEndToCheck < todayDateToCheck) return false;
    else return true;
}

const addEventListenerToTaskTitle = () => {
    const allTasksName = document.querySelectorAll(".task--header");

    allTasksName.forEach((task,index) => {
        task.addEventListener("input" , () => {
            allTasks[index].taskName = task.textContent;
            sendItemsToLocalStorage();
        })
    })
}

const addEventListenerToDeleteButtons = () => {
    const binButtons = [...document.querySelectorAll(".task--bin-icon")];

    binButtons.forEach((button,index) => {
        button.addEventListener("click", () => {
            allTasks.splice(index,1);

            sendItemsToLocalStorage();
            printAllTasks();
        })
    })
}

const addEventListenerToConfirmButtons = () => {
    const confirmButtons = [...document.querySelectorAll(".task--confirm-icon")];

    confirmButtons.forEach((button,index) => {
        button.addEventListener("click", () => {
            const taskHeaders = document.querySelectorAll(".task--header");
            const taskDates = document.querySelectorAll(".task--date");

            taskHeaders[index].classList.toggle("task--header--unactive");
            taskDates[index].classList.toggle("task--date--unactive");
            allTasks[index].isActive = !allTasks[index].isActive;

            sendItemsToLocalStorage();
        })
    })
}

addTaskButton.addEventListener("click", () => {
    if(checkCorrectnessOfInputs(titleInput.value, dateInput.value)) {
        warningParagraph.textContent = "";

        const todayDate = new Date();
        const yearToday = todayDate.getFullYear();
        const monthToday = ((todayDate.getMonth()+1 < 10)? `0${todayDate.getMonth()+1}` : todayDate.getMonth()+1);
        const dayToday = todayDate.getDate();
        const hourToday = todayDate.getHours();
        const minutesToday = ((todayDate.getMinutes() < 10)? `0${todayDate.getMinutes()}` : todayDate.getMinutes());
        const fullDateToday = `${dayToday}.${monthToday}.${yearToday} ${hourToday}:${minutesToday}`;
    
        let dateEnd = dateInput.value.split("-");
        let timeEnd = dateEnd[2].split("T");
        dateEnd[2] = dateEnd[2].substr(0,2);
        dateEnd.reverse();
        dateEnd = dateEnd.join(".");
        timeEnd.splice(0,1);
        timeEnd = timeEnd[0];

        const task = new Task(titleInput.value, fullDateToday, `${dateEnd} ${timeEnd}`, true);
        allTasks.push(task);
    
        printAllTasks();
        sendItemsToLocalStorage();   
    }
    else warningParagraph.textContent = "Brak danych lub błędna data";  
})

if("allTasks" in localStorage) {
    downloadDataFromLocalStorage();
    printAllTasks();
}