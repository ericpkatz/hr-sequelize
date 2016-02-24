var seed = require('./seed');
var Employee = require('../models').models.Employee;
var EmployeeDepartment = require('../models').models.EmployeeDepartment;
var Department = require('../models').models.Department;
var expect = require('chai').expect;
describe('Employee', function(){
  beforeEach(function(done){
    seed()
      .then(function(){
        done();
      });
  });
  it('exists', function(){
    expect(Employee).to.be.ok;
  });

  describe('employees departments', function(){
    var departments;
    beforeEach(function(done){
      Employee.find({ 
          where: {
            name: 'Shep'
          },
          include:[
            { model: Department, as: 'departments' }
          ] 
     })
    .then(function(employee){
        departments = employee.departments.map(function(department){
          return department.name;
        });
        done();
      });
    });
    it('shep is in the accounting department', function(){
      expect(departments).to.eql(['Accounting', 'Engineering']);
    });
  
  });

  describe('findAll employees', function(){
    var employee, moesDepartments;
    beforeEach(function(done){
      Employee.findAll({ include: [ { model: Department, as: 'manages' }]})
        .then(function(_employees){
          employees = _employees;
          moesDepartments = _employees
            .filter(function(emp){ return emp.name === 'Moe'; })[0]
            .manages.map(function(dep){ return dep.name; });
          done();
        });
    
    });
    it('there are 4', function(){
      expect(employees.length).to.equal(4);
    });
    it('Moe manages accounting', function(){
      expect(moesDepartments).to.eql(['Accounting']);
    });
  });

});
