# system-static-aurelia-loader


### Note

Based on [fuse-box-aurelia-loader](https://github.com/fuse-box/fuse-box-aurelia-loader)

Make sure you read all the docs to avoid unnecessary problems with Aurelia not finding modules.


### How to install
```npm install git://github.com/MaximBalaganskiy/system-static-aurelia-loader```


### How to use

* Create a file `bootstrap.js`

```javascript
import { initialize } from "aurelia-pal-browser";
initialize();
import "system-static-aurelia-loader";
import "aurelia-bootstrapper";
```

The reason you need this is that `aurelia-bootstrapper` calls `initialize` only after the document is loaded. By that time all the modules will be registered and executed. This creates an issue with dependency injection of types from `DOM` (e.g. `DOM.Element`) which is not initialized yet.

* Add a `gulp` task to build a bundle and inject modules mapping into the `index.html`. Modify the following example according to your configuration.

```javascript
var gulp = require("gulp");
var Builder = require('systemjs-builder');
var revPath = require("rev-path");
var revHash = require("rev-hash");
var fs = require("fs");
var htmlReplace = require("gulp-html-replace");

var root = "wwwroot/";
var distFolder = "dist/";
var distPath = root + distFolder;
var builder = new Builder(root, root + "jspm.config.js");

var bundle = [
	"aurelia-bootstrapper",
	"aurelia-pal-browser",
	"aurelia-loader",
	"aurelia-framework",
	"aurelia-logging-console",
	"aurelia-templating-binding",
	"aurelia-templating-resources",
	"aurelia-event-aggregator",
	"aurelia-history-browser",
	"aurelia-templating-router",
	"aurelia-polyfills",
	"aurelia-templating",
	"aurelia-logging",
	"aurelia-pal",
	"fetch",
	"src/**/*.js",
	"src/**/*.html!text",
	"src/**/*.css!text"
];

gulp.task("build", function () {
	return builder
		.buildStatic(bundle.join(" + "), { sourceMaps: false, encodeNames: false, minify: true }) // !!! `encodeNames: false` is very important
		.then(content => {
			var fileName = revPath("build.js", revHash(new Buffer(content.source, 'utf-8')));
			fs.writeFileSync(distPath + fileName, content.source);
			var map = {};
			var unknown = [];
			for (var module of content.modules) {
				// match a jspm module
				var m = /^(npm|github):([a-zA-Z-\.\/]+)@([\d\.]+)\/([a-zA-Z-\d\_\.\/]+).(js|css|html)(!.*)?$/.exec(module);
				if (m) {
					if (m[2] === m[4]) {
						map[m[2]] = module;
					}
					else {
						map[m[2] + "/" + m[4] + (m[5] === "js" ? "" : ("." + m[5]))] = module;
					}
				}
				else {
					// match application module
					var lm = /^([a-zA-Z-\d\/\s\.]+).(js|html|css|min.css)(!.*)?/.exec(module);
					if (lm) {
						map[lm[1] + (lm[2] === "js" ? "" : ("." + lm[2]))] = module;
					} else {
						unknown.push(module);
					}
				}
			}
			// fix some exceptions
			map["fetch"] = map["github/fetch/fetch"];
			if (unknown.length) {
				throw new Error("Could not create mapping for " + JSON.stringify(unknown));
			}
			var mappings = "var $__SystemMapping = " + JSON.stringify(map);
			var mappingFileName = getOutFileName(mappings, "build.mapping.js", true);
			fs.writeFileSync(distPath + mappingFileName, mappings);
			return gulp
				.src(root + "index.html")
				.pipe(htmlReplace({ js: [distFolder + mappingFileName, distFolder + fileName] }, { keepBlockTags: true, keepUnassigned: true }))
				.pipe(gulp.dest(root));
		});
});
```

### How to develop/improve loader
 * run `node setup` to to npm install in root and sample folder
 * run `gulp build` to create new build
