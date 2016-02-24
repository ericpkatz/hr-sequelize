var gulp = require('gulp');
var seed = require('./test/seed');

gulp.task('seed', function(){
  return seed();


});
