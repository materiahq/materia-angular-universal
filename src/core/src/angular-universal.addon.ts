import "reflect-metadata";

import { ngExpressEngine } from "@nguniversal/express-engine";
// Import module map for lazy loading
const {
	provideModuleMap
} = require("@nguniversal/module-map-ngfactory-loader");
import { join } from "path";
const {
	AppServerModuleNgFactory,
	LAZY_MODULE_MAP
} = require(__dirname + "/../../../client/dist/server/main.bundle");
export class AngularUniversalAddon {
	public static displayName = "Angular Universal";
	public static logo = "http://i1.wp.com/wassimchegham.com/wp/wp-content/uploads/2015/10/138338bc-7806-11e5-8057-d34c75f3cafc.png?w=1272";

	public static installSettings = [];

	constructor(
		private app: any,
		private config: any,
		private expressApp: any
	) {}

	start() {
		console.log("In start express app :", this.expressApp);
		const DIST_FOLDER = this.app.path + "/client/dist";

		// Express Engine

		/* this.expressApp.engine(
			"html",
			ngExpressEngine({
				bootstrap: AppServerModuleNgFactory,
				providers: [provideModuleMap(LAZY_MODULE_MAP)]
			})
		);

		this.expressApp.set("view engine", "html");
		this.expressApp.set("views", join(DIST_FOLDER, "browser"));

		// All regular routes use the Universal engine
		this.expressApp.get("*", (req, res) => {
			res.render(join(DIST_FOLDER, "browser", "index.html"), { req });
		});
	}

	afterSave() {
		console.log("In AFTER START express app :", this.expressApp);
	}*/
	}
}
