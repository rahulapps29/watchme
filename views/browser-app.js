const formAlertDOM = document.querySelector(".form-alert");
const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputName = document.querySelector(".task-name");
const taskInputMeal = document.querySelector(".task-meal");
const taskDateTimeDOM = document.querySelector(".task-edit-dateTime");
const taskInputSugar = document.querySelector(".task-sugar");
const taskInputInsulin = document.querySelector(".task-insulin");
const taskInputLantus = document.querySelector(".task-lantus");
const taskInputComment = document.querySelector(".task-comment");

function setCurrentDateTime() {
  const now = new Date();
  // Get the timezone offset in minutes and convert it to milliseconds
  const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
  // Adjust the current time by the timezone offset
  const localDate = new Date(now.getTime() - timezoneOffset);
  // Format date and time as 'YYYY-MM-DDTHH:MM'
  const formattedDateTime = localDate.toISOString().slice(0, 16);
  document.querySelector(".task-edit-dateTime").value = formattedDateTime;
}

// Call the function when the page loads
window.onload = setCurrentDateTime;

const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const {
      data: { tasks },
    } = await axios.get("/api/tasks/d");
    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }
    const allTasks = tasks
      .map((task) => {
        const {
          _id: taskID,
          name,
          meal,
          comment,
          sugar,
          insulin,
          lantus,
          tDate,
        } = task;
        return `<div class="single-task">
<h5><span><i class="far fa-check-circle"></i></span>
     ${tDate.substring(0, 10)}  ${new Date(tDate).toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}: ${name} : ${meal} : ${comment} : sugar ${sugar} mg/dl : insulin ${insulin} units (.01 ml) : Lantus ${lantus} units (.01 ml)</h5>
<div class="task-links">
<!-- edit link -->
<a href="task.html?id=${taskID}"  class="edit-link">
<i class="fas fa-edit"></i>
</a>
<!-- delete btn -->
<button type="button" class="delete-btn" data-id="${taskID}">
<i class="fas fa-trash"></i>
</button>
</div>
</div>`;
      })
      .join("");
    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    try {
      const userConfirmed = confirm(
        "Are you sure you want to delete this transaction?"
      );
      if (!userConfirmed) {
        // If the user cancels, prevent the delete action

        alert("Deletion canceled");
      } else {
        // Proceed with the deletion
        await axios.delete(`/api/tasks/${id}`);
        showTasks();
        alert("Item deleted successfully");
        // You can add your deletion logic here
      }
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputName.value;
  const meal = taskInputMeal.value;
  const inputValue = taskDateTimeDOM.value;
  const tDate = new Date(inputValue);
  console.log("tDateTime:", tDate);
  let comment = taskInputComment.value.toLowerCase();

  if (comment.search("break fast") >= 0) {
    comment = "breakfast";
  }
  if (!comment.includes("before")) {
    comment = "before " + comment;
  }
  const sugar = taskInputSugar.value;
  const insulin = taskInputInsulin.value;
  const lantus = taskInputLantus.value;
  try {
    const userConfirmed = confirm("Are you sure you want to Add this entry?");
    if (!userConfirmed) {
      // If the user cancels, prevent the delete action

      alert("Entry canceled");
    } else {
      // Proceed with the deletion

      await axios.post("/api/tasks", {
        name,
        meal,
        comment,
        sugar,
        insulin,
        lantus,
        tDate,
      });

      showTasks();
      alert("Entry Added successfully");
      // You can add your deletion logic here
    }

    taskInputName.value = "";
    taskInputMeal.value = "";
    taskInputComment.value = "";
    taskInputSugar.value = "";
    taskInputInsulin.value = "";
    taskInputLantus.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, Entry added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 1500);
});
