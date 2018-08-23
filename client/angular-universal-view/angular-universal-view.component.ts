
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddonView } from '@materia/addons';

@AddonView('@materia/angular-universal')
@Component({
    selector: 'mau-addon-view',
    templateUrl: './angular-universal-view.component.html',
    styleUrls: ['./angular-universal-view.component.scss'],
    providers: []
})
export class AngularUniversalViewComponent implements OnInit {
    @Input() app;
    @Input() settings;

    @Output() openSetup = new EventEmitter<void>();

    constructor() { }

    ngOnInit() {
    }
}
