var Promise = require('bluebird'); 
var Sequelize = require('sequelize');
var db = new Sequelize(process.env.CONN, {timestamps: false});

var Department = db.define('department', {
  name: Sequelize.STRING
}, {timestamps: false});

var Employee = db.define('employee', {
  name: Sequelize.STRING
}, {timestamps: false});

var EmployeeDepartment = db.define('employeeDepartment', {
  primary: Sequelize.BOOLEAN
}, { timestamps: false});

EmployeeDepartment.belongsTo(Department, { as: 'department'});
EmployeeDepartment.belongsTo(Employee, { as: 'employee' });

Employee.belongsToMany(Department, { as: 'departments', through: EmployeeDepartment });
Department.belongsToMany(Employee, { as: 'employees', through: EmployeeDepartment });

Employee.hasMany(Department, { as: 'manages', foreignKey: 'managerId' });
Department.belongsTo(Employee, { as: 'manager', foreignKey: 'managerId' });

//Department.hasMany(Employee);
var _conn;
module.exports = {
  connect: function(){
    if(_conn)
      return _conn;
    _conn = db.authenticate();
    return _conn;
  },
  sync: function(){
    return db.sync({force: true});
  },
  models: {
    Department: Department,
    Employee: Employee,
    EmployeeDepartment: EmployeeDepartment
  }
};
