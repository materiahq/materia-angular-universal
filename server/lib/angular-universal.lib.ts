import * as fs from 'fs';
import { join } from 'path';
import * as express from 'express';
import * as execa from 'execa';

export class AngularUniversalLib {
    public static isLaunched = false;
    expressApp: any;
    angularRootFolderPath: string;
    angularSourceFolderPath: string;
    angularDistFolderPath: string;

    get clientConfig() {
        return this.app.config.get('dev', 'client');
    }

    constructor(private app: any) {
        this.expressApp = this.app.server.expressApp;
    }

    enableAngularProdMode() {
        const angularCore = require(join(this.angularRootFolderPath, 'node_modules', '@angular', 'core'));
        // Faster server renders w/ Prod mode (dev mode never needed)
        angularCore.enableProdMode();
    }

    async getAngularPaths() {
        if (this.clientConfig && this.clientConfig.dist && this.isAngularProject()) {
            const angularJson = await this.getAngularConfig();
            this.angularRootFolderPath = join(this.app.path, this.clientConfig.src);

            // Check if mono or two packages structure
            if (this.clientConfig.src && !angularJson.projects[angularJson.defaultProject].root) {
                this.angularSourceFolderPath = this.angularRootFolderPath;
            } else {
                this.angularSourceFolderPath = join(this.app.path, angularJson.projects[angularJson.defaultProject].root);
            }
            this.angularDistFolderPath = join(this.angularSourceFolderPath, 'dist');
        } else {
            return false;
        }
    }

    getAngularConfig(): Promise<any> {
        return new Promise((resolve, reject) => {
            fs.readFile(join(this.app.path, this.clientConfig.src, 'angular.json'), 'utf8', (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(JSON.parse(result));
            });
        });
    }

    isAngularProject(): boolean {
        if (this.clientConfig) {
            return fs.existsSync(join(this.app.path, this.clientConfig.src, 'angular.json'));
        }
        return false;
    }

    isCompiledForUniversal(): boolean {
        return fs.existsSync(join(this.angularDistFolderPath, 'server', 'main.js'));
    }

    isSSRLaunched() {
        return AngularUniversalLib.isLaunched;
    }

    async isUniversal(): Promise<boolean> {
        const cliConfig: any = await this.getAngularConfig();
        const project: any = cliConfig.projects[cliConfig.defaultProject].architect;
        for (const property in project) {
            if (project.hasOwnProperty(property) && project[property].builder === '@angular-devkit/build-angular:server') {
                return true;
            }
        }
        return false;
    }

    async launchConnection() {
        await this.getAngularPaths();
        if (this.isCompiledForUniversal()) {
            this.loadAngularDependencies();
            this.launchSSR();
        }
    }

    launchSSR() {
        const universalExpressEngine = require(join(this.angularRootFolderPath, 'node_modules', '@nguniversal/express-engine'));
        const moduleMapNgFactoryLoader = require(
            join(
                this.angularRootFolderPath,
                'node_modules',
                '@nguniversal/module-map-ngfactory-loader')
        );

        const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(join(this.angularDistFolderPath, 'server', 'main'));

        this.expressApp.engine('html', universalExpressEngine.ngExpressEngine({
            bootstrap: AppServerModuleNgFactory,
            providers: [
                moduleMapNgFactoryLoader.provideModuleMap(LAZY_MODULE_MAP)
            ]
        }));

        this.expressApp.set('view engine', 'html');
        this.expressApp.set('views', join(this.angularDistFolderPath, 'browser'));

        this.app.api.registerEndpoints();
        this.expressApp.all('/api/*', (req, res) => {
            res.status(404).send({
                error: true,
                message: 'API endpoint not found'
            });
        });

        // Server static files from /browser
        this.expressApp.get('*.*', express.static(join(this.angularDistFolderPath, 'browser'), {
            maxAge: '1y'
        }));

        // ALl regular routes use the Universal engine
        this.expressApp.get('*', (req, res) => {
            res.render('index', { req });
        });

        AngularUniversalLib.isLaunched = true;
    }

    loadAngularDependencies() {
        try {
            this.loadZoneJs();
            this.loadReflectMetadata();
            this.enableAngularProdMode();
            return;
        } catch (err) {
            return;
        }
    }

    loadZoneJs() {
        require(join(this.angularRootFolderPath, 'node_modules', 'zone.js/dist/zone-node'));
    }

    loadReflectMetadata() {
        require(join(this.angularRootFolderPath, 'node_modules', 'reflect-metadata'));
    }

    async runUniversalSchematics(): Promise<any> {
        await this.getAngularPaths();
        const isUniversal = await this.isUniversal();
        if ( ! isUniversal ) {
            const result = await this.runAngularCliCommand(this.angularRootFolderPath, 'add', ['@materia/schematics-universal']);
            if (typeof result === 'string') {
                return { data: result };
            } else {
                return result;
            }
        } else {
            return Promise.resolve({ message: 'Your Angular Project is already configured for Universal' });
        }
    }

    runAngularCliCommand(folder, command, params): Promise<string> {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(join(folder, 'node_modules', '.bin', 'ng'))) {
                let data = '';
                const stream = execa(join(folder, 'node_modules', '.bin', 'ng'), [command, ...params], {
                    cwd: folder
                });
                stream.stdout.on('data', d => {
                    data += d;
                });
                stream.stderr.on('data', (d) => {
                    data += d;
                });
                stream.on('close', (code) => {
                    if (code === 0) {
                        return resolve(data);
                    } else {
                        return reject({
                            code,
                            data
                        });
                    }
                });
            } else {
                reject({ message: '@angular/cli not found' });
            }
        });
    }
}

