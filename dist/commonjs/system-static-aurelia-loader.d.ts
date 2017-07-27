import { Loader, TemplateRegistryEntry } from "aurelia-loader";
export declare class TextTemplateLoader {
    loadTemplate(loader: Loader, entry: TemplateRegistryEntry): Promise<void>;
}
export declare class SystemStaticAureliaLoader extends Loader {
    loaderPlugins: any;
    templateLoader: TextTemplateLoader;
    moduleRegistry: any;
    modulesBeingLoaded: Map<string, Promise<any>>;
    private $__System;
    private mapping;
    private logger;
    constructor();
    useTemplateLoader(templateLoader: TextTemplateLoader): void;
    loadAllModules(ids: any[]): Promise<any>;
    loadTemplate(url: any): Promise<TemplateRegistryEntry>;
    loadText(url: any): Promise<string>;
    loadModule(moduleId: any): Promise<any>;
    normalize(moduleId: any, relativeTo: any): Promise<any>;
    map(): void;
    addPlugin(pluginName: any, implementation: any): void;
    applyPluginToUrl(url: any, pluginName: any): string;
    _import(address: any): Promise<any>;
    private findJspmPath(moduleId);
    private loadWithJspm(modulePath);
}
