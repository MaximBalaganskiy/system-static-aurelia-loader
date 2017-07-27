var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_metadata_1 = require("aurelia-metadata");
var aurelia_loader_1 = require("aurelia-loader");
var aurelia_pal_1 = require("aurelia-pal");
var aurelia_logging_1 = require("aurelia-logging");
var TextTemplateLoader = (function () {
    function TextTemplateLoader() {
    }
    TextTemplateLoader.prototype.loadTemplate = function (loader, entry) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, loader.loadText(entry.address)];
                    case 1:
                        text = _a.sent();
                        entry.template = aurelia_pal_1.DOM.createTemplateFromMarkup(text);
                        return [2];
                }
            });
        });
    };
    return TextTemplateLoader;
}());
exports.TextTemplateLoader = TextTemplateLoader;
function ensureOriginOnExports(executed, name) {
    var target = executed;
    var key;
    var exportedValue;
    if (target.__useDefault) {
        target = target["default"];
    }
    aurelia_metadata_1.Origin.set(target, new aurelia_metadata_1.Origin(name, "default"));
    for (key in target) {
        exportedValue = target[key];
        if (typeof exportedValue === "function") {
            aurelia_metadata_1.Origin.set(exportedValue, new aurelia_metadata_1.Origin(name, key));
        }
    }
    return executed;
}
var SystemStaticAureliaLoader = (function (_super) {
    __extends(SystemStaticAureliaLoader, _super);
    function SystemStaticAureliaLoader() {
        var _this = _super.call(this) || this;
        _this.loaderPlugins = Object.create(null);
        _this.moduleRegistry = Object.create(null);
        _this.modulesBeingLoaded = new Map();
        _this.$__System = $__System;
        _this.mapping = $__SystemMapping;
        _this.logger = aurelia_logging_1.getLogger("system-static-aurelia-loader");
        _this.useTemplateLoader(new TextTemplateLoader());
        _this.addPlugin("template-registry-entry", {
            "fetch": function (address) { return __awaiter(_this, void 0, void 0, function () {
                var entry;
                return __generator(this, function (_a) {
                    this.logger.debug("fetch => ", address);
                    entry = this.getOrCreateTemplateRegistryEntry(address);
                    return [2, entry.templateIsLoaded ? entry : this.templateLoader.loadTemplate(this, entry).then(function () { return entry; })];
                });
            }); }
        });
        var that = _this;
        aurelia_pal_1.PLATFORM.eachModule = function (callback) {
            for (var key in that.moduleRegistry) {
                try {
                    if (that.moduleRegistry[key]) {
                        if (callback(key, that.moduleRegistry[key])) {
                            return;
                        }
                    }
                }
                catch (e) {
                    _this.logger.error("eachModule => ", e);
                }
            }
        };
        return _this;
    }
    SystemStaticAureliaLoader.prototype.useTemplateLoader = function (templateLoader) {
        this.logger.debug("useTemplateLoader => ", templateLoader);
        this.templateLoader = templateLoader;
    };
    SystemStaticAureliaLoader.prototype.loadAllModules = function (ids) {
        var _this = this;
        this.logger.debug("loadAllModules => ", arguments);
        return Promise.all(ids.map(function (id) { return _this.loadModule(id); }));
    };
    SystemStaticAureliaLoader.prototype.loadTemplate = function (url) {
        this.logger.debug("loadTemplate => ", url);
        return this._import(this.applyPluginToUrl(url, "template-registry-entry"));
    };
    SystemStaticAureliaLoader.prototype.loadText = function (url) {
        this.logger.debug("loadText => ", url);
        return Promise.resolve(this.loadWithJspm(this.findJspmPath(url))).then(function (textOrModule) {
            if (typeof textOrModule === "string") {
                return textOrModule;
            }
            if (textOrModule["default"]) {
                return textOrModule["default"];
            }
            else {
                return "";
            }
        });
    };
    SystemStaticAureliaLoader.prototype.loadModule = function (moduleId) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, beingLoaded, moduleExports;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.debug("loadModule => ", moduleId);
                        existing = this.moduleRegistry[moduleId];
                        if (existing) {
                            return [2, existing];
                        }
                        beingLoaded = this.modulesBeingLoaded.get(moduleId);
                        if (beingLoaded) {
                            return [2, beingLoaded];
                        }
                        beingLoaded = this._import(moduleId);
                        this.modulesBeingLoaded.set(moduleId, beingLoaded);
                        return [4, beingLoaded];
                    case 1:
                        moduleExports = _a.sent();
                        this.moduleRegistry[moduleId] = ensureOriginOnExports(moduleExports, moduleId);
                        this.modulesBeingLoaded.delete(moduleId);
                        return [2, moduleExports];
                }
            });
        });
    };
    SystemStaticAureliaLoader.prototype.normalize = function (moduleId, relativeTo) {
        this.logger.debug("info", "normalize =>", [moduleId, relativeTo]);
        return Promise.resolve(moduleId);
    };
    SystemStaticAureliaLoader.prototype.map = function () { };
    SystemStaticAureliaLoader.prototype.addPlugin = function (pluginName, implementation) {
        this.logger.debug("addPlugin => ", pluginName);
        this.loaderPlugins[pluginName] = implementation;
    };
    SystemStaticAureliaLoader.prototype.applyPluginToUrl = function (url, pluginName) {
        this.logger.debug("applyPluginToUrl =>", arguments);
        return pluginName + "!" + url;
    };
    SystemStaticAureliaLoader.prototype._import = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var addressParts, moduleId, loaderPlugin, plugin, err_1, modulePath, module;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addressParts = address.split("!");
                        moduleId = addressParts.splice(addressParts.length - 1, 1)[0];
                        loaderPlugin = addressParts.length === 1 ? addressParts[0] : null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!loaderPlugin) return [3, 3];
                        plugin = this.loaderPlugins[loaderPlugin];
                        if (!plugin) {
                            throw new Error("Plugin " + loaderPlugin + " is not registered in the loader.");
                        }
                        return [4, plugin.fetch(moduleId)];
                    case 2: return [2, _a.sent()];
                    case 3: return [3, 5];
                    case 4:
                        err_1 = _a.sent();
                        throw new Error("\n\t\t\t\tJspm-loader _import() telling this not registered in the loader: " + address + ", module id was: " + moduleId + "\n\t\t\t\tDid you forget to add it to bundle?\n\t\t\t\t" + err_1 + "\n\t\t\t");
                    case 5:
                        modulePath = this.findJspmPath(moduleId);
                        try {
                            if (!modulePath) {
                                throw new Error("Module path not found for module " + moduleId);
                            }
                            module = this.loadWithJspm(modulePath);
                            module = ensureOriginOnExports(module, moduleId);
                            this.moduleRegistry[moduleId] = module;
                            return [2, Promise.resolve(module)];
                        }
                        catch (err) {
                            throw new Error("\n\t\t\t\tJspm-loader _import() telling this not registered in the loader: " + address + ", module path returned: " + modulePath + "\n\t\t\t\tDid you forget to add it to bundle?\n\t\t\t\t" + err);
                        }
                        return [2];
                }
            });
        });
    };
    SystemStaticAureliaLoader.prototype.findJspmPath = function (moduleId) {
        return this.mapping[moduleId];
    };
    SystemStaticAureliaLoader.prototype.loadWithJspm = function (modulePath) {
        return this.$__System.registry.get(modulePath);
    };
    return SystemStaticAureliaLoader;
}(aurelia_loader_1.Loader));
exports.SystemStaticAureliaLoader = SystemStaticAureliaLoader;
aurelia_pal_1.PLATFORM.Loader = SystemStaticAureliaLoader;
aurelia_pal_1.PLATFORM.$__SystemStaticAureliaLoader = true;
