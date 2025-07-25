import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ContainerComponent,
  HeaderComponent,
  HeaderNavComponent,
} from '@coreui/angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  imports: [ContainerComponent, HeaderNavComponent, RouterLink],
})
export class DefaultHeaderComponent extends HeaderComponent {
  constructor() {
    super();
  }
}
