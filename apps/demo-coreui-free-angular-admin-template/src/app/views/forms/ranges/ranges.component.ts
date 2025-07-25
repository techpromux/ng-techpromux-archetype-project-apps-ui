import { Component } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormControlDirective,
  FormLabelDirective,
  RowComponent,
} from '@coreui/angular';
import {
  DocsComponentsComponent,
  DocsExampleComponent,
} from '../../../components';

@Component({
  selector: 'app-ranges',
  templateUrl: './ranges.component.html',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    DocsExampleComponent,
    FormLabelDirective,
    FormControlDirective,
    DocsComponentsComponent,
  ],
})
export class RangesComponent {}
