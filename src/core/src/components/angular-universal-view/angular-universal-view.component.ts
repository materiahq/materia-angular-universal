const ngcore = (window as any).angular.core;
const Component = ngcore.Component;

@Component({
  selector: "materia-angular-universal-view",
  templateUrl: "./angular-universal-view.component.html",
  styleUrls: ["./angular-universal-view.component.scss"]
})

export class AngularUniversalViewComponent {
  constructor() { }
}
