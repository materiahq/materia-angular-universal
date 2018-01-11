// External modules
// const CommonModule = (window as any).angular.common.CommonModule;
const CommonModule = (window as any).angular.common.CommonModule;

const NgModule = (window as any).angular.core.NgModule;
// Angular CDK
// Angular material
const MatButtonModule = (window as any).angular.material.MatButtonModule;
const MatCardModule = (window as any).angular.material.MatCardModule;
const MatIconModule = (window as any).angular.material.MatIconModule;
const MatTooltipModule = (window as any).angular.material.MatTooltipModule;
const MatListModule = (window as any).angular.material.MatListModule;
const MatProgressBarModule = (window as any).angular.material.MatProgressBarModule;
const MatProgressSpinnerModule = (window as any).angular.material.MatProgressBarModule;

const FlexLayoutModule = (window as any).angular.flexLayout.FlexLayoutModule;

// Components and directives
import { AngularUniversalViewComponent } from "./components";

// Addon class
export { AngularUniversalAddon } from "./angular-universal.addon";

@NgModule({
	imports: [
		// Angular modules
		CommonModule,

		FlexLayoutModule,

		// Material modules
		MatButtonModule,
		MatCardModule,
		MatIconModule,
		MatListModule,
		MatTooltipModule,
		MatProgressBarModule,
		MatProgressSpinnerModule
	],
	exports: [AngularUniversalViewComponent],
	declarations: [AngularUniversalViewComponent],
	entryComponents: [AngularUniversalViewComponent],
	providers: []
})
export class AngularUniversalModule {
	static getViewComponent() {
		return AngularUniversalViewComponent;
	}
}