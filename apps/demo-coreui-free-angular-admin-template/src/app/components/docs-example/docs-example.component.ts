import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import {
  NavComponent,
  NavItemComponent,
  NavLinkDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import packageJson from '../../../../../../package.json';

@Component({
  selector: 'app-docs-example',
  templateUrl: './docs-example.component.html',
  styleUrls: ['./docs-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavComponent,
    NavItemComponent,
    NavLinkDirective,
    RouterLink,
    IconDirective,
  ],
  host: {
    class: 'example',
  },
})
export class DocsExampleComponent {
  readonly #changeDetectorRef = inject(ChangeDetectorRef);

  readonly hrefInput = input<string>('https://coreui.io/angular/docs/', {
    alias: 'href',
  });
  readonly fragment = input<string>();

  readonly href = computed(() => {
    const version = packageJson?.version;
    const docsUrl = 'https://coreui.io/angular/';
    const href = this.hrefInput();
    // const path: string = version ? `${version}/${href}` : `${href}`;
    const path: string = href;
    this.#changeDetectorRef.markForCheck();
    return `${docsUrl}${path}`;
  });
}
