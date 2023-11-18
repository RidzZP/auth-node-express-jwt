const { Sequelize } = require("sequelize");

const db = new Sequelize("testdb", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
