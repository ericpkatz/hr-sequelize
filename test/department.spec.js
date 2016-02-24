var seed = require('./seed');
var Department = require('../models').models.Department;
var Employee = require('../models').models.Employee;
var expect = require('chai').expect;
describe('department', function(){
  beforeEach(function(done){
    seed()
      .then(function(){
        done();
      });
  });
  it('exists', function(){
    expect(Department).to.be.ok;
  });

  describe('department employees', function(){
    var employees;
    beforeEach(function(done){
      Department.find({
        where: {
          name: 'Accounting'
        },
        include: [
          { model: Employee, as: 'employees' }
        ]
      })
      .then(function(department){
        employees = department.employees.map(function(employee){
          return employee.name;
        });
        done();
      });
    
    });

    it('has moe and shep', function(){
      expect(employees).to.eql(['Moe', 'Shep']);
    });
  
  });

  describe('findAll departments', function(){
    var departments, accounting;
    beforeEach(function(done){
      Department.findAll({include: { model: Employee, as: 'manager'}})
        .then(function(_departments){
          departments = _departments;
          accounting = departments.filter(function(department){
            return department.name === 'Accounting';
          })[0];
          done();
        });
    
    });
    it('there are two', function(){
      expect(departments.length).to.equal(3);
    });

    it('moe manages accounting', function(){
      expect(accounting.manager.name).to.equal('Moe');
    });
  });

});
