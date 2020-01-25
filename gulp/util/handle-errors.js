import notify from 'gulp-notify';
import gutil from 'gulp-util';
import browserSync from 'browser-sync';

module.exports  =  function(error) {
	let lineNumber = (error.line) ? 'LINE ' + error.line + ' -- ' : '';
	notify({
		title: 'Error at [' + error.plugin + ']',
		message: lineNumber + 'See console.',
		open: 'subl.exe',
		sound: true // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
	}).write(error);

	gutil.beep(); // Beep 'sosumi' again

	// Inspect the error object
	//console.log(error);

	// Easy error reporting
	//console.log(error.toString());

	// Pretty error reporting
	let report = '';
	let chalk = gutil.colors.white.bgRed;

	report += chalk('TASK:') + ' [' + error.plugin + ']\n';
	if (error.file) {
		report += chalk('FILE:') + ' ' + error.file + '\n';
	}
	if (error.line) {
		report += chalk('LINE:') + ' ' + error.line + '\n';
	}
	report += chalk('PROB:') + ' ' + error.message + '\n';
	console.error(report);

	this.emit('end');

};
// module.exports = function(error) {
// 	let lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';
// 	let args = Array.prototype.slice.call(arguments);
// 	notify.onError({
// 		title: 'Error [' + error.plugin + ']',
// 		message: '<%= error.message %>',
// 		reply: true,
// 		sound: true
// 	}).apply(this, args);

// 	this.emit('end');
// };
