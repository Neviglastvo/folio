import gulp from 'gulp';
import config from '../config.js';
import cache from 'gulp-cache';
import imagemin from 'gulp-imagemin';

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

gulp.task('copy:fonts', () => gulp
  .src(config.src.fonts + '/**/*')
  .pipe(gulp.dest(config.dest.fonts))
);

// gulp.task('copy:data', () => gulp
//   .src(config.src.data + '/**/*.*')
//   .pipe(gulp.dest(config.dest.data))
// );

gulp.task('copy:rootfiles', () => gulp
  .src(config.src.root + '/*.*')
  .pipe(gulp.dest(config.dest.root))
);

const build = gulp => gulp.series('copy:img', 'copy:fonts');
const watch = gulp => () => gulp.watch(config.src.img + '/*', gulp.parallel('copy:img', 'copy:fonts'));

module.exports.build = build;
module.exports.watch = watch;
