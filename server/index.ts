import * as express from "express";
import { join } from "path";
import { readFileSync } from "fs";

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)

/* const requireWithoutCache = (name) => {
	let p = require.resolve(name);
	if (require.cache[p]) {
			delete require.cache[p]
	}
	return require(name)
} */

export class AngularUniversalAddon {
	public static displayName = "Angular Universal";
	public static logo = "http://i1.wp.com/wassimchegham.com/wp/wp-content/uploads/2015/10/138338bc-7806-11e5-8057-d34c75f3cafc.png?w=1272";
	public static installSettings = [
	];
	app;
	expressApp;

	constructor(app: any, config: any, expressApp: any) { 
		this.app = app;
		this.expressApp = expressApp;
	}

	start() {
		require(this.app.path + "/client/node_modules/reflect-metadata");
		// Express Engine
		const { ngExpressEngine } = require(this.app.path + "/client/node_modules/@nguniversal/express-engine");
		// Import module map for lazy loading
		const { provideModuleMap } = require(this.app.path + "/client/node_modules/@nguniversal/module-map-ngfactory-loader");
		const { renderModuleFactory } = require(this.app.path + "/client/node_modules/@angular/platform-server");
		const { enableProdMode } = require(this.app.path + "/client/node_modules/@angular/core");
		// Faster server renders w/ Prod mode (dev mode never needed)
		enableProdMode();

		// Express server
		const DIST_FOLDER = join(this.app.path, "client", "dist");
		// Our index.html we"ll use as our template
		const template = readFileSync(join(DIST_FOLDER, "browser", "index.html")).toString();

		// * NOTE :: leave this as require() since this file is built Dynamically from webpack
		const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(this.app.path + "/client/dist/server/main.bundle");
		this.expressApp.engine("html", ngExpressEngine({
			bootstrap: AppServerModuleNgFactory,
			providers: [
				provideModuleMap(LAZY_MODULE_MAP)
			]
		}));

		this.expressApp.set("view engine", "html");
		this.expressApp.set("views", join(DIST_FOLDER, "browser"));

		/* - Example Express Rest API endpoints -
			this.expressApp.get("/api/**", (req, res) => { });
		*/
		this.app.api.registerEndpoints();
		this.expressApp.all("/api/*", (req, res) => {
			res.status(404).send({
				error: true,
				message: "API endpoint not found"
			});
		});
		// Server static files from /browser
		this.expressApp.get("*.*", express.static(join(DIST_FOLDER, "browser"), {
			maxAge: "1y"
		}));

		// ALl regular routes use the Universal engine
		this.expressApp.get("*", (req, res) => {
			res.render("index", { req });
		});

	}

	uninstall(app) { }
}