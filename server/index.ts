import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { join } from 'path';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

export class MateriaAngularUniversal {
    public static displayName = 'Angular Universal';
    public static logo = 'https://raw.githubusercontent.com/thyb/materia-website-content/master/logo/addons/angular-universal.png';
    public static installSettings = [];

    constructor(private app: any, private config: any, private expressApp: any) {}

    start() {
        const DIST_FOLDER = join(this.app.path, 'client', 'dist');

        // Faster server renders w/ Prod mode (dev mode never needed)
        enableProdMode();
        const express = require('express');

        // * NOTE :: leave this as require() since this file is built Dynamically from webpack
        const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(join(DIST_FOLDER, 'server/main'));

        this.expressApp.engine('html', ngExpressEngine({
            bootstrap: AppServerModuleNgFactory,
            providers: [
                provideModuleMap(LAZY_MODULE_MAP)
            ]
        }));

        this.expressApp.set('view engine', 'html');
        this.expressApp.set('views', join(DIST_FOLDER, 'browser'));

        // Re add Materia Server api after expressApp modifications
        this.app.api.registerEndpoints();
        this.expressApp.all('/api/*', (req, res) => {
            res.status(404).send({
                error: true,
                message: 'API endpoint not found'
            });
        });

        // Server static files from /browser
        this.expressApp.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
            maxAge: '1y'
        }));

        // ALl regular routes use the Universal engine
        this.expressApp.get('*', (req, res) => {
            res.render('index', { req });
        });
    }

    uninstall() { }
}
