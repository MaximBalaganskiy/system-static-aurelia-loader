import { Origin } from "aurelia-metadata";
import { Loader, TemplateRegistryEntry } from "aurelia-loader";
import { PLATFORM, DOM } from "aurelia-pal";
import { getLogger, Logger } from "aurelia-logging";

declare var $__System: any;
declare var $__SystemMapping: any;

export class TextTemplateLoader {
	public async loadTemplate(loader: Loader, entry: TemplateRegistryEntry) {
		const text = await loader.loadText(entry.address);
		entry.template = DOM.createTemplateFromMarkup(text);
	}
}

function ensureOriginOnExports(executed: any, name: any) {
	let target = executed;
	let key;
	let exportedValue;

	if (target.__useDefault) {
		target = target["default"];
	}

	Origin.set(target, new Origin(name, "default"));

	for (key in target) {
		if (target.hasOwnProperty(key)) {
			exportedValue = target[key];

			if (typeof exportedValue === "function") {
				Origin.set(exportedValue, new Origin(name, key));
			}
		}
	}

	return executed;
}

export class SystemStaticAureliaLoader extends Loader {
	public loaderPlugins = Object.create(null);
	public templateLoader: TextTemplateLoader;
	public moduleRegistry = Object.create(null);
	public modulesBeingLoaded = new Map<string, Promise<any>>();
	private $__System: any = $__System;
	private mapping = $__SystemMapping;
	private logger: Logger;

	constructor() {
		super();

		this.logger = getLogger("system-static-aurelia-loader");
		this.useTemplateLoader(new TextTemplateLoader());

		this.addPlugin("template-registry-entry", {
			"fetch": async (address: any) => {
				this.logger.debug("fetch => ", address);
				let entry = this.getOrCreateTemplateRegistryEntry(address);
				return entry.templateIsLoaded ? entry : this.templateLoader.loadTemplate(this, entry).then(() => entry);
			}
		});

		let that = this;
		PLATFORM.eachModule = (callback) => {
			for (let key in that.moduleRegistry) {
				if (that.moduleRegistry.hasOwnProperty(key)) {
					try {
						if (that.moduleRegistry[key]) {
							if (callback(key, that.moduleRegistry[key])) {
								return;
							}
						}
					} catch (e) {
						this.logger.error("eachModule => ", e);
					}
				}
			}
		};
	}

	public useTemplateLoader(templateLoader: TextTemplateLoader) {
		this.logger.debug("useTemplateLoader => ", templateLoader);
		this.templateLoader = templateLoader;
	}

	public loadAllModules(ids: any[]): Promise<any> {
		this.logger.debug("loadAllModules => ", arguments);
		return Promise.all(
			ids.map(id => this.loadModule(id))
		);
	}

	public loadTemplate(url: any): Promise<TemplateRegistryEntry> {
		this.logger.debug("loadTemplate => ", url);
		return this._import(this.applyPluginToUrl(url, "template-registry-entry"));
	}

	public loadText(url: any): Promise<string> {
		this.logger.debug("loadText => ", url);
		return Promise.resolve(this.loadWithJspm(this.findJspmPath(url))).then(textOrModule => {
			if (typeof textOrModule === "string") {
				return textOrModule;
			}
			if (textOrModule["default"]) {
				return textOrModule["default"];
			} else {
				return "";
			}
		});
	}

	public async loadModule(moduleId: any) {
		this.logger.debug("loadModule => ", moduleId);
		let existing = this.moduleRegistry[moduleId];
		if (existing) {
			return existing;
		}

		let beingLoaded = this.modulesBeingLoaded.get(moduleId);
		if (beingLoaded) {
			return beingLoaded;
		}

		beingLoaded = this._import(moduleId);
		this.modulesBeingLoaded.set(moduleId, beingLoaded);
		const moduleExports = await beingLoaded;
		this.moduleRegistry[moduleId] = ensureOriginOnExports(moduleExports, moduleId);
		this.modulesBeingLoaded.delete(moduleId);
		return moduleExports;
	}

	public normalize(moduleId: any, relativeTo: any) {
		this.logger.debug("info", "normalize =>", [moduleId, relativeTo]);
		return Promise.resolve(moduleId);
	}

	public map(/*id: any, source: any*/) {/*nothing*/ }

	public addPlugin(pluginName: any, implementation: any) {
		this.logger.debug("addPlugin => ", pluginName);
		this.loaderPlugins[pluginName] = implementation;
	}

	public applyPluginToUrl(url: any, pluginName: any) {
		this.logger.debug("applyPluginToUrl =>", arguments);
		return `${pluginName}!${url}`;
	}

	public async _import(address: any): Promise<any> {

		const addressParts = address.split("!");
		const moduleId = addressParts.splice(addressParts.length - 1, 1)[0];
		const loaderPlugin = addressParts.length === 1 ? addressParts[0] : null;

		try {
			if (loaderPlugin) {
				const plugin = this.loaderPlugins[loaderPlugin];
				if (!plugin) {
					throw new Error(`Plugin ${loaderPlugin} is not registered in the loader.`);
				}
				return await plugin.fetch(moduleId);
			}
		} catch (err) {
			throw new Error(`
				Jspm-loader _import() telling this not registered in the loader: ${address}, module id was: ${moduleId}
				Did you forget to add it to bundle?
				${err}
			`);
		}

		// not loader plugin....
		let modulePath = this.findJspmPath(moduleId);
		try {
			if (!modulePath) {
				throw new Error(`Module path not found for module ${moduleId}`);
			}
			let module = this.loadWithJspm(modulePath);
			module = ensureOriginOnExports(module, moduleId);
			this.moduleRegistry[moduleId] = module;
			return Promise.resolve(module);
		} catch (err) {
			throw new Error(`
				Jspm-loader _import() telling this not registered in the loader: ${address}, module path returned: ${modulePath}
				Did you forget to add it to bundle?
				${err}`);
		}
	}

	private findJspmPath(moduleId: string): string {
		return this.mapping[moduleId];
	}

	private loadWithJspm(modulePath: string): any {
		return this.$__System.registry.get(modulePath);
	}
}

PLATFORM.Loader = SystemStaticAureliaLoader;
(<any>PLATFORM).$__SystemStaticAureliaLoader = true;
