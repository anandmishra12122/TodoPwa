
let task = document.querySelector("#taskName")
let type = document.querySelector("#type")
let priority = document.querySelector("#priority")
let date = document.querySelector("#date")
let time = document.querySelector("#time")
let btn = document.querySelector("#addbtn")
let body = document.querySelector("body")
btn.addEventListener("click",addtask)
let totaltaskcount = 0;
let totalpendingcount = 0;
let totalcomplete = 0;
function addtask(){
    if(task.value && type.value && priority.value && date.value && time.value)
    {
        let TaskDataObject = {
            TaskName : task.value,
            TaskType : type.value,
            TaskPriority : priority.value,
            TaskDate : date.value,
            TaskTime : time.value,
            notified:false
        };
        let GetTasks = JSON.parse(localStorage.getItem("UserTask")) || [];
        GetTasks.push(TaskDataObject)

        localStorage.setItem("UserTask" , JSON.stringify(GetTasks))
        let totaltask = document.querySelector("#totaltask")
        let totalpending = document.querySelector("#pendingtask")
        totaltaskcount++;
        totalpendingcount++;
        totaltask.textContent = totaltaskcount;
        totalpending.textContent = totalpendingcount;
        let alltasks = JSON.parse(localStorage.getItem("UserTask"))
        let lasttask = alltasks[alltasks.length-1]
        viewtask(lasttask)
        
        notification("✅ Added Sucessfully")
    }
    else
    {
        notification("⚠️Fill All Data")
    }
}

function notification (msg){
    let div = document.createElement("div")
            let h4 = document.createElement("h4")
            div.className = "noti"
            div.append(h4)
            h4.textContent = msg;
            console.log(div)
            document.body.prepend(div)
        setTimeout(()=>{
            div.remove()
        },5000)
}

let alltasks = JSON.parse(localStorage.getItem("UserTask"))
    if(alltasks !== null)
    {
        alltasks.forEach((data)=>{
            viewtask(data)
        })
    }



function viewtask(task){
    let maindiv = document.querySelector("#scrollBox")
    let div1 = document.createElement("div")
    let div2 = document.createElement("div")
    let div3 = document.createElement("div")
    div1.className = "task-card"
    div2.className = "task-info"
    div3.className = "task-actions"
    div1.append(div2,div3)
    
    let h3 = document.createElement("h3")
    h3.className = "task-name"
    h3.textContent = task.TaskName
    let p1 = document.createElement("p")
    p1.textContent = "Type :" + task.TaskType
    let p2 = document.createElement("p")
    p2.textContent = "Date :" +task.TaskDate
    let p3 = document.createElement("p")
    p3.textContent = "Time :" +task.TaskTime
    let p4 = document.createElement("p")
    p4.textContent = "Priority :" +task.TaskPriority
    div2.append(h3,p1,p2,p3,p4)

    let combtn = document.createElement("button")
    let delbtn = document.createElement("button")
    combtn.className = "btn"
    delbtn.className = "btn"
    combtn.textContent = "✔ Complete"
    delbtn.textContent = "🗑 Delete"

    combtn.addEventListener("click", () => {
        DeleteTask(task, div1);
    });

    delbtn.addEventListener("click", () => {
        DeleteTask(task, div1);
    });

    div3.append(combtn,delbtn) 
    maindiv.append(div1)
}


let searchvalue = document.querySelector("#Searchbox");
searchvalue.addEventListener("input",function(data){
    setTimeout(()=>{
        Search()
    },2000)
})

function Search(){
    let alldiv = document.querySelectorAll(".task-card")
        alldiv.forEach((item)=>{
            let h3 = item.querySelectorAll("h3")
            h3.forEach((text)=>{
                if(!text.innerHTML.includes(searchvalue.value))
                {
                   item.style.display = "none"
                }
                else
                {
                    item.style.display = "block"
                }
            })
        })
}

let button = document.querySelectorAll(".all")
button.forEach((eachbtn)=>{
    eachbtn.addEventListener("click",function(clickedbtn){
        let alldiv = document.querySelectorAll(".task-card")
        alldiv.forEach((item)=>{
            let p = item.querySelector("p")
            if(clickedbtn.target.value.toUpperCase() === "ALL")
            {
                item.style.display = "block"
            }
            else
            {
                if(p.innerHTML.substring(6).toUpperCase() === clickedbtn.target.value.toUpperCase())
                {
                    item.style.display = "block"
                }
                else
                {
                    item.style.display = "none"
                }
            }
        })
    })
})


function DeleteTask(task, card) {
    card.remove();

    let tasks = JSON.parse(localStorage.getItem("UserTask")) || [];

    tasks = tasks.filter((t) => {
        return !(
            t.TaskName === task.TaskName &&
            t.TaskDate === task.TaskDate &&
            t.TaskTime === task.TaskTime
        );
    });
    localStorage.setItem("UserTask", JSON.stringify(tasks));
}

function checkTaskReminder(){
    console.log("Checking.....")
    let Tasks = JSON.parse(localStorage.getItem("UserTask")) || [];
    let now = new Date()

    Tasks.forEach((task)=>{
        let Taskdatetime = new Date(`${task.TaskDate}T${task.TaskTime}`)

        if(now >= Taskdatetime && task.notified === false)
        {
            let diff = Math.floor((now - Taskdatetime) / 60000);

            if (diff <= 1) {
                new Notification("🔥 TASK ALERT 🔥", {
                body: `🚀 ${task.TaskName}\n⏰ Due Now!\n🎯 Don't break the streak!`
                });
            }

            else{
                new Notification("❌ Task Missed", {
                    body: `😔 ${task.TaskName}\n⌛ You're ${diff} min late`
                });
            }

            task.notified = true;
        }

        
    })
        
    localStorage.setItem("UserTask",JSON.stringify(Tasks))

}

checkTaskReminder()
setInterval(checkTaskReminder,10000)

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".notify-btn").addEventListener("click", async () => {
    const permission = await Notification.requestPermission();
    alert("Button clicked 🚀");
    if (permission === "granted") {
      new Notification("TaskFlow", {
        body: "Notifications Enabled 🚀"
      });
    }
  });
});
