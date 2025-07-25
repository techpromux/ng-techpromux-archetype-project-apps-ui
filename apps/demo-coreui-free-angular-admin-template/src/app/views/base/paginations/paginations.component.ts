import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  PageItemComponent,
  PageLinkDirective,
  PaginationComponent,
  RowComponent,
} from '@coreui/angular';
import {
  DocsComponentsComponent,
  DocsExampleComponent,
} from '../../../components';

@Component({
  selector: 'app-paginations',
  templateUrl: './paginations.component.html',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    DocsExampleComponent,
    PaginationComponent,
    PageItemComponent,
    PageLinkDirective,
    RouterLink,
    DocsComponentsComponent,
  ],
})
export class PaginationsComponent {}
