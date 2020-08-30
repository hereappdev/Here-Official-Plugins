var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
const minify = require('gulp-minify');

// gulp.task('compress', function() {
//   return gulp.src('dist/**/*.js')
//     .pipe(minify())
//     .pipe(minify({
//         ext:{
//             // src:'-debug.js',
//             min:'.js'
//         },
//         exclude: ['tasks'],
//         ignoreFiles: ['.combo.js', '-min.js', '-debug.js']
//     }))
//     .pipe(gulp.dest('dist'))
// });

gulp.task("ts", function () {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist"));
});

gulp.task("copyFile", function () {
    return gulp
        .src([
            "src/**/*", //Include All files
            "!src/**/*.ts", //It will exclude typescript files
        ])
        .pipe(gulp.dest("dist/src"));
});

gulp.task("distribute", function () {
    return gulp
        .src([
            "dist/src/**/*", //Include All files
        ])
        .pipe(gulp.dest("../source"));
});

gulp.task("default", gulp.series("ts", "copyFile", "distribute"), () => {
    console.log(`Done.`);
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', gulp.series("ts", "copyFile", "distribute"));
});
