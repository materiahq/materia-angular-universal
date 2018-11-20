import { AngularUniversalLib } from '../../lib/angular-universal.lib';

class AngularUniversal {
    angularUniversalLib: AngularUniversalLib;

    constructor(private app: any) {
        this.angularUniversalLib = new AngularUniversalLib(this.app);
    }

    getAngularConfig() {
        return this.angularUniversalLib.getAngularConfig();
    }

    isAngular() {
        return { isAngular: this.angularUniversalLib.isAngularProject() };
    }

    isCompiledForUniversal() {
        return { isCompiledForUniversal: this.angularUniversalLib.isCompiledForUniversal() };
    }

    isSSRLaunched() {
        return { isSSRLaunched: this.angularUniversalLib.isSSRLaunched() };
    }

    isUniversal() {
        return this.angularUniversalLib.isUniversal()
        .then(isUniversal => ({isUniversal: isUniversal}))
        .catch(() => ( { isUniversal: false } ));
    }

    launchSSR() {
        return this.launchSSR();
    }

    list() {
        const isAngular = this.isAngular();
        const isSSRLaunched = this.isSSRLaunched();
        return this.angularUniversalLib.getAngularPaths().then(() => {
            return this.isUniversal();
        }).then((isUniversal) => {
            const isCompiledForUniversal = this.isCompiledForUniversal();
            return Object.assign({}, isAngular, isSSRLaunched, isUniversal, isCompiledForUniversal);
        }).catch(() => {
            return Object.assign({}, isAngular, isSSRLaunched, { isUniversal: false, isCompiledForUniversal: false });
        });
    }

    runUniversalSchematics() {
        this.app.watcher.disable();
        return this.angularUniversalLib.runUniversalSchematics().then((result) => {
            const clientConfig = this.app.config.get('dev', 'client');
            if (! clientConfig.scripts) {
                clientConfig.scripts = {};
            }
            clientConfig.scripts.prod = 'build:prod';
            return this.app.config.save().then(() => {
                this.app.watcher.enable();
                return result;
            });
        }).catch((err) => {
            this.app.watcher.enable();
            return err;
        });

    }

}
export = AngularUniversal;
