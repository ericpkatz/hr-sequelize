process.env.CONN = 'sqlite:hr.db';
var Promise = require('bluebird');
var models = require('../models');
var Department = require('../models').models.Department;
var Employee = require('../models').models.Employee;
var EmployeeDepartment = require('../models').models.EmployeeDepartment;

module.exports = function(){
  var moe, larry, curly, shep;
  var accounting, sales, engineering;

  return models.connect()
    .then(function(){
      return models.sync({force: true});
    })
    .then(function(){
      return Promise.all([
          Employee.create({ name: 'Moe' }),
          Employee.create({ name: 'Larry' }),
          Employee.create({ name: 'Curly' }),
          Employee.create({ name: 'Shep' })
      ]);
    })
    .spread(function(_moe, _larry, _curly, _shep){
      moe = _moe;
      larry = _larry; 
      curly = _curly;
      shep = _shep;
      return Promise.all([
          Department.create({ name: 'Accounting', managerId: moe.id }),
          Department.create({ name: 'Sales', managerId: larry.id }),
          Department.create({ name: 'Engineering', managerId: curly.id })
      ]);
    })
    .spread(function(_accounting, _sales, _engineering){
      accounting = _accounting;
      sales = _sales;
      engineering = _engineering;
    })
    .then(function(){
      return EmployeeDepartment.create({ employeeId: moe.id, departmentId: accounting.id });
    })
    .then(function(departmentEmployee){
      return EmployeeDepartment.create({ employeeId: shep.id, departmentId: accounting.id });
    })
    .then(function(departmentEmployee){
      return EmployeeDepartment.create({ employeeId: shep.id, departmentId: engineering.id });
    });
};
