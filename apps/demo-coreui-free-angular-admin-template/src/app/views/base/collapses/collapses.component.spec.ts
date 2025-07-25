import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import {
  ButtonModule,
  CardModule,
  CollapseModule,
  GridModule,
} from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../icons/icon-subset';
import { CollapsesComponent } from './collapses.component';

describe('CollapsesComponent', () => {
  let component: CollapsesComponent;
  let fixture: ComponentFixture<CollapsesComponent>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CardModule,
        CollapseModule,
        NoopAnimationsModule,
        GridModule,
        ButtonModule,
        CollapsesComponent,
      ],
      providers: [IconSetService, provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(CollapsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
