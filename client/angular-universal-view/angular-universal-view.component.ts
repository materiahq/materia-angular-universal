
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AddonView } from '@materia/addons';
import { QueryService } from '../services/query.service';

export interface IUniversalStatus {
    isAngular: boolean;
    isUniversal: boolean;
    isSSRLaunched: boolean;
    isCompiledForUniversal: boolean;
}

@AddonView('@materia/angular-universal')
@Component({
    selector: 'mau-addon-view',
    templateUrl: './angular-universal-view.component.html',
    styleUrls: ['./angular-universal-view.component.scss'],
    providers: []
})
export class AngularUniversalViewComponent implements OnInit, OnDestroy {
    @Input() app;
    @Input() settings;
    @Input() baseUrl;
    @Input() websocketMessage$: Observable<{type: string, message: string}>;

    @Output() openSetup = new EventEmitter<void>();
    @Output() restartServer = new EventEmitter<void>();

    status: IUniversalStatus;
    angularConfig: any;
    schematicsRunning: boolean;
    tested: boolean;
    building: boolean;

    componentDestroyed$ = new Subject<void>();

    get isAngularProject() {
        return this.status && this.status.isAngular;
    }

    get isUniversal() {
        return this.status && this.status.isUniversal;
    }

    get isCompiledForUniversal() {
        return this.status && this.status.isCompiledForUniversal;
    }

    get isSSRLaunched() {
        return this.status && this.status.isSSRLaunched;
    }

    constructor(private queryService: QueryService, private router: Router) { }

    ngOnInit() {
        this.loadUniversalStatus();
        this.websocketMessage$.pipe(
            filter(websocketMessage =>
                websocketMessage.type === 'client:build:success' || websocketMessage.type === 'client:build:error'
            ),
            takeUntil(this.componentDestroyed$ as any)
        )
        .subscribe((websocketMessage) => {
            this.building = false;
            this.loadUniversalStatus();
        });
    }

    async loadUniversalStatus() {
        this.tested = false;
        const statusResult = await (this.getUniversalStatus() as Promise<{count: number, data: [IUniversalStatus]}>);
        this.status = statusResult.data[0];
        this.tested = true;
        if (this.status.isAngular) {
            const angularConfigResult = await (this.getAngularConfig() as Promise<{count: number, data: [any]}>);
            this.angularConfig = angularConfigResult.data[0];
        }
    }

    getUniversalStatus() {
        return this.queryService.runQuery(this.baseUrl, 'angular-universal', 'list');
    }

    getAngularConfig() {
        return this.queryService.runQuery(this.baseUrl, 'angular-universal', 'getAngularConfig');
    }

    openClientSettings() {
        this.router.navigate(['dashboard', 'settings'], {queryParams: {section: 'client'}});
    }

    goToWebsite() {
        this.router.navigateByUrl('dashboard/website');
    }

    launchProductionBuild() {
        this.building = true;
        this.queryService.launchClientBuild(this.baseUrl, true);
    }

    restartMateria() {
        this.restartServer.emit();
        this.loadUniversalStatus();
    }

    runSchematics() {
        this.schematicsRunning = true;
        return this.queryService.runQuery(this.baseUrl, 'angular-universal', 'runUniversalSchematics').then((result) => {
            this.schematicsRunning = false;
            this.loadUniversalStatus();
        });
    }

    ngOnDestroy() {
        this.componentDestroyed$.next();
        this.componentDestroyed$.complete();
    }
}
