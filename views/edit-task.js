const taskIdDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskMealDOM = document.querySelector(".task-edit-meal");
const taskDateTimeDOM = document.querySelector(".task-edit-dateTime");
const taskCommentDOM = document.querySelector(".task-edit-comment");
const taskSugarDOM = document.querySelector(".task-edit-sugar");
const taskInsulinDOM = document.querySelector(".task-edit-insulin");
const taskLantusDOM = document.querySelector(".task-edit-lantus");

const editFormDOM = document.querySelector(".single-task-form");
const editBtnDOM = document.querySelector(".task-edit-btn");
const formAlertDOM = document.querySelector(".form-alert");
const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let tempDesc;

const showTask = async () => {
  try {
    const {
      data: { task },
    } = await axios.get(`/api/tasks/${id}`);
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

    const tDateTime = new Date(tDate);
    const localISOTime = new Date(
      tDateTime.getTime() - tDateTime.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    const formattedDateTime = localISOTime;
    taskDateTimeDOM.value = formattedDateTime;
    taskIdDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskMealDOM.value = meal;
    taskCommentDOM.value = comment;
    taskSugarDOM.value = sugar;
    taskInsulinDOM.value = insulin;
    taskLantusDOM.value = lantus;
  } catch (error) {
    console.log(error);
  }
};

showTask();

editFormDOM.addEventListener("submit", async (e) => {
  editBtnDOM.textContent = "Loading...";
  e.preventDefault();

  try {
    const taskName = taskNameDOM.value;
    const taskMeal = taskMealDOM.value;
    const inputValue = taskDateTimeDOM.value;
    const taskDate = new Date(inputValue);
    console.log("tDateTime:", taskDate);
    const taskComment = taskCommentDOM.value;
    const taskSugar = taskSugarDOM.value;
    const taskInsulin = taskInsulinDOM.value;
    const taskLantus = taskLantusDOM.value;

    const {
      data: { task },
    } = await axios.patch(`/api/tasks/${id}`, {
      name: taskName,
      meal: taskMeal,
      tDate: taskDate,
      comment: taskComment,
      sugar: taskSugar,
      insulin: taskInsulin,
      lantus: taskLantus,
    });

    const {
      _id: taskID,
      name,
      meal,
      tDate,
      comment,
      sugar,
      insulin,
      lantus,
    } = task;

    taskIdDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskMealDOM.value = meal;
    taskCommentDOM.value = comment;
    taskSugarDOM.value = sugar;
    taskInsulinDOM.value = insulin;
    tempDesc = name;

    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, edited task`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    console.error(error);
    taskNameDOM.value = tempDesc;
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  editBtnDOM.textContent = "Edit";
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 1500);
});
