import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { take, timer } from 'rxjs';

import { ContainerComponent, FooterComponent } from '@coreui/angular';

import { CommonModule } from '@angular/common';
import { DefaultFooterComponent, DefaultHeaderComponent } from './';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    CommonModule,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    RouterOutlet,
    FooterComponent,
  ],
})
export class DefaultLayoutComponent {
  public theme = 'light'; // dark

  public loading = true;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor() {
    timer(2000)
      .pipe(take(1))
      .subscribe((val) => {
        this.loading = false;
      });
  }
}
