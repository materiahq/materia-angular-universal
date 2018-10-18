import { AngularUniversalLib } from './lib/angular-universal.lib';

export class MateriaAngularUniversal {
    public static initialize: boolean;
    public static displayName = 'Angular Universal';
    public static logo = 'https://raw.githubusercontent.com/thyb/materia-website-content/master/logo/addons/angular-universal.png';
    public static installSettings = [];

    angularUniversalLib: AngularUniversalLib;

    get clientConfig() {
        return this.app.config.get('dev', 'client');
    }

    constructor(private app: any, private config: any, private expressApp: any) {
        this.angularUniversalLib = new AngularUniversalLib(this.app);
    }

    afterLoadAPI() {
        this.angularUniversalLib.launchConnection();
    }

    uninstall() { }
}
