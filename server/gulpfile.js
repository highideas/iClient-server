var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function(){
    var error = false;
    gulp.
        src('./tests/*js').
        pipe(mocha()).
        on('error', function(){
            console.log("Test Falied");
            error = true;
        }).
        on('end', function(){
            if (!error) {
                console.log('Tests succeeded!');
                process.exit(0);
            }
        });
});

gulp.task('watch', function(){
    gulp.watch(['./schemas/*.js'], ['test']);
});

