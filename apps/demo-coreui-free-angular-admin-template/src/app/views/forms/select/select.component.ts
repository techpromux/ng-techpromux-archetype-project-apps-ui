import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormSelectDirective,
  RowComponent,
} from '@coreui/angular';
import {
  DocsComponentsComponent,
  DocsExampleComponent,
} from '../../../components';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    DocsExampleComponent,
    FormSelectDirective,
    ReactiveFormsModule,
    DocsComponentsComponent,
  ],
})
export class SelectComponent {}
