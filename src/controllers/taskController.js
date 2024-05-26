const { Task } = require("../db/models");
const { Student } = require("../db/models");

const taskController = {
  create: async (req, res) => {
    const student = await Student.findByPk(req.params.studentId);
    if (!student) res.status(404).send({ message: 'Student not found' });
    try {
      const {
        content,
        isCompleted,
      } = req.body;

      const newTask = await Task.create({
        content,
        isCompleted,
        StudentId: student.id
      });
      //const TaskResponse = { ...newTask.toJSON() };
      return res.status(201).send(newTask);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  getTasks: async (req, res) => {

    try {
      const student = await Student.findByPk(req.params.studentId);
      if (!student) res.status(404).send({ message: 'Student not found' });
      const studentTasks = await Task.findAll({
        where: {
          StudentId: student.id
        },
      });

      //const TaskResponse = { ...newTask.toJSON() };
      return res.status(200).send(studentTasks);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  deleteTask: async (req, res) => {
    try {
      // Buscar el Taske por su ID
      const task = await Task.findByPk(req.params.taskId);

      // Verificar si el Taske existe
      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }

      // Eliminar el Taske usando Sequelize
      await task.destroy();

      // Enviar una respuesta de éxito
      return res.status(200).send({ message: 'Tarea eliminada satisfactoriamente' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  updateTask: async (req, res) => {
    try {
      // Buscar el Taske por su ID
      const task = await Task.findByPk(req.params.taskId);

      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }

      const {
        content,
        isCompleted,
      } = req.body;

      task.content = content;
      task.isCompleted = isCompleted;
      await task.save();


      // Enviar una respuesta de éxito
      res.status(200).send({ message: 'Tarea actualizada correctamente' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
}

module.exports = taskController;