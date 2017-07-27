# system-static-aurelia-loader


### Note

Based on [fuse-box-aurelia-loader](https://github.com/fuse-box/fuse-box-aurelia-loader)

Make sure you check out a [sample project](https://github.com/MaximBalaganskiy/system-static-aurelia-loader-sample).


### How to install

```jspm install system-static-aurelia-loader=git:MaximBalaganskiy/system-static-aurelia-loader```


### How to use

```javascript
import "system-static-aurelia-loader";
```

### Gotchas

* At the moment, simplified `$__System` loader does not expose a map of modules or encoded module names. Because of that you need to provide it yourself in a `__SystemMapping` global variable. Luckily, there is a way to automate this using `systemjs-builder` itself. Have a look at [gulpfile.js](https://github.com/MaximBalaganskiy/system-static-aurelia-loader-sample/blob/master/gulpfile.js) to learn how. 
* Aurelia initializes `DOM` in `aurelia-bootstrapper` only after a document is loaded. By that time all the modules will have been registered and executed. This creates an issue with dependency injection annotations (e.g. `DOM.Element`) which will all be `null`. To work around this create a [boostrap](https://github.com/MaximBalaganskiy/system-static-aurelia-loader-sample/blob/master/src/bootstrap.ts) file to force `DOM` initialisation before annotations are created.

### How to develop/improve loader

* run `npm install` to install dependencies
* run `gulp build` to create new build
 