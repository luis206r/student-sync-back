const { Report } = require("../db/models");
const { Student } = require("../db/models");

const reportController = {
  create: async (req, res) => {
    const student = await Student.findByPk(req.params.studentId);
    if (!student) res.status(404).send({ message: 'Student not found' });
    try {
      const {
        score,
        content,
      } = req.body;

      const newReport = await Report.create({
        score,
        content,
        StudentId: student.id
      });
      //const reportResponse = { ...newReport.toJSON() };
      res.status(201).send(newReport);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  getReports: async (req, res) => {

    try {
      const student = await Student.findByPk(req.params.studentId);
      if (!student) res.status(404).send({ message: 'Student not found' });
      const studentReports = await Report.findAll({
        where: {
          StudentId: student.id
        },
        order: [['createdAt', 'ASC']],
      });

      //const reportResponse = { ...newReport.toJSON() };
      res.status(200).send(studentReports);

    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
  deleteReport: async (req, res) => {
    try {
      // Buscar el reporte por su ID
      const report = await Report.findByPk(req.params.reportId);

      // Verificar si el reporte existe
      if (!report) {
        return res.status(404).send({ message: 'Report not found' });
      }

      // Eliminar el reporte usando Sequelize
      await report.destroy();

      // Enviar una respuesta de éxito
      res.status(200).send({ message: 'Reporte eliminado satisfactoriamente' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: "Error interno del servidor." });
    }
  },
}

module.exports = reportController;