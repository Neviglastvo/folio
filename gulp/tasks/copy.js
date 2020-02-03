import gulp from 'gulp';
import config from '../config.js';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';

gulp.task('copy:rootfiles', () => gulp
  .src([
    config.src.root + '/**/*.*',
    '!' + config.src.img + '/**/*.*',
    '!' + config.src.js + '/**/*.*',
    '!' + config.src.icons + '/**/*.*',
    '!' + config.src.sass + '/**/*.*',
    '!' + config.src.templates + '/**/*.*'
    ])
  .pipe(gulp.dest(config.dest.root))
);

gulp.task('copy:img', () => gulp
  .src([
    config.src.img + '/**/*.{jpg,png,jpeg,svg,gif,mp4,webm}',
    '!' + config.src.img + '/svgo/**/*.*'
    ])
  // .pipe(cache(imagemin({
  //   interlaced: true
  // })))
  .pipe(gulp.dest(config.dest.img))
);

const build = gulp => gulp.series('copy:img', 'copy:rootfiles');
const watch = gulp => () => gulp.watch(config.src.img + '/*', gulp.parallel('copy:img', 'copy:rootfiles'));

module.exports.build = build;
module.exports.watch = watch;
