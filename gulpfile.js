var gulp         = require('gulp'),
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	cleancss     = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	pug          = require('gulp-pug'),
	sourcemaps   = require('gulp-sourcemaps'),
	gulpDebug    = require('gulp-debug'),
	sourcemaps    = require('gulp-sourcemaps'),
	fs = require('fs'),
	path = require('path'),
	mergeJson = require('gulp-merge-json');


//paths
var project = {
	site: {
		root: './',
		html: './',
		css: './css/',
	},
	src: {
		root: './src/',
		jsonDir: './src/data/',
		json: './src/data/**/*.json',
		dataJson: "./src/temp/data.json",
		temp: "./src/temp",
		pug: [
			'./src/pug/index.pug',
		],
		pugSrc:[
			'./src/pug/**/*.pug',
			'./src/pug/*.pug'
		],
		sass: './src/sass/*.sass',
		sassSrc: [
			'./src/sass/*.sass',
			'./src/sass/*.scss',
			'./src/sass/**/*.sass',
		]
	},
};


// Local Server
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: project.site.root
		},
		notify: false,
		open: false // set true to automatically open browser folder localhost:3000
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	})
});
function bsReload(done) { browserSync.reload(); done(); };

// pug

gulp.task('pug:data', function () {
	return gulp.src(project.src.json)
		.pipe(mergeJson({
			fileName: 'data.json',
			edit: function (json, file) {
				var filename = path.basename(file.path),
					primaryKey = filename.replace(path.extname(filename), ''),
					data = {"data": {}};

				data["data"][primaryKey] = json;
				return data;
			}
		}))
		.pipe(gulp.dest(project.src.temp));
});
gulp.task('bsReload', function(done){
	browserSync.reload();
	done();
});

gulp.task('pug',
	gulp.series(
		'pug:data',
		function buildHTML() {
			return gulp.src(project.src.pug)
				.pipe(pug({
					pretty: true,
					data: JSON.parse(fs.readFileSync(project.src.dataJson))
				}))
				.pipe(gulp.dest(project.site.html))
		},
		'bsReload'
	)
);



var options = {
	libs: [
		'./node_modules/',
	]
}

// Custom Styles
gulp.task('styles', function() {
	return gulp.src(project.src.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded',
			includePaths: [options.libs]
		}))
		//.pipe(gulpDebug({title: "sass"})) //uncomment to see compiled files
		//.pipe(cleancss()) // uncomment for styles minification
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ['last 30 versions']
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(project.site.css))
		.pipe(browserSync.stream())
});



gulp.task('watch', function() {
	gulp.watch(project.src.sassSrc, gulp.parallel('styles'));
	gulp.watch(project.src.pugSrc, gulp.parallel('pug'));
});

gulp.task('build',  gulp.parallel('styles', 'pug'));

gulp.task('default', gulp.parallel('styles', 'browser-sync', 'pug', 'watch'));

