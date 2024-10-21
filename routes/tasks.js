const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { getAlldynamic } = require("../controllers/dtasks");
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  editTask,
} = require("../controllers/tasks");

router.route("/").get(authenticateToken, getAllTasks).post(createTask);
router.route("/d").get(authenticateToken, getAlldynamic);
router
  .route("/:id")
  .get(authenticateToken, getTask)
  .patch(authenticateToken, updateTask)
  .delete(authenticateToken, deleteTask);

module.exports = router;
