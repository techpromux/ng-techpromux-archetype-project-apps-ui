import { Component, inject } from '@angular/core';
import { FooterComponent } from '@coreui/angular';
import { DatePipe } from '@angular/common';
import { APP_VERSION } from '../../../config/app.vars';

@Component({
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss'],
  imports: [DatePipe],
})
export class DefaultFooterComponent extends FooterComponent {
  version: string = inject(APP_VERSION);

  currentDate: Date = new Date();

  constructor() {
    super();
  }
}
