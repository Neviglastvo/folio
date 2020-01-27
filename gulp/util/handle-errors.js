import notifier from 'node-notifier';
import notify from 'gulp-notify';
import gutil from 'gulp-util';
// import browserSync from 'browser-sync';
var browserSync = require('browser-sync').create();

module.exports = function(error) {

	let lineNumber = (error.line) ? 'LINE ' + error.line + ' -- ' : '',
		report = '',
		chalk = gutil.colors.white.bgRed;

	report += chalk('TASK:') + ' [' + error.plugin + ']\n';
	if (error.file) {
		report += chalk('FILE:') + ' ' + error.file + '\n';
	}
	if (error.line) {
		report += chalk('LINE:') + ' ' + error.line + '\n';
	}
	report += chalk('PROB:') + ' ' + error.message + '\n';

	console.error(report);

	notifier.notify({
		title: 'Error at [' + error.plugin + ']',
		message: lineNumber + 'See console.',
		sound: true
	});

	setTimeout(function() {
		browserSync.sockets.emit('fullscreen:message', {
			title: error.plugin,
			body: report
		});
	}, 5000);

	this.emit('end');

};
