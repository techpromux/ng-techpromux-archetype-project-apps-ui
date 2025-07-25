/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, NgStyle } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ProgressBarComponent,
  ProgressComponent,
  RowComponent,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';

import {
  BatteryInfo,
  Device,
  DeviceId,
  DeviceInfo,
  GetLanguageCodeResult,
  LanguageTag,
} from '@capacitor/device';

import { Subject, takeUntil, timer } from 'rxjs';

import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Dialog } from '@capacitor/dialog';

import { Clipboard } from '@capacitor/clipboard';

declare global {
  interface Window {
    DiskSpacePlugin: any;
  }
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [
    CommonModule,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ReactiveFormsModule,
    ChartjsComponent,
    NgStyle,
    ProgressComponent,
    ButtonModule,
    CardHeaderComponent,
    ProgressBarComponent,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // ---------------------------------------------------------------------------------------

  logger = console;

  destroy$: Subject<boolean> = new Subject();

  // ---------------------------------------------------------------------------------------

  deviceInfo: {
    id?: DeviceId;
    info?: DeviceInfo;
    batteryInfo?: BatteryInfo;
    languageCode?: GetLanguageCodeResult;
    languageTag?: LanguageTag;
    diskInfo: {
      app: number;
      free: number;
      total: number;
    };
  } = {
    id: undefined,
    info: undefined,
    batteryInfo: undefined,
    languageCode: undefined,
    languageTag: undefined,
    diskInfo: {
      app: 0,
      free: 1000,
      total: 1000,
    },
  };

  // ---------------------------------------------------------------------------------------

  utilData: {
    memoryData: any;
    diskData: any;
  } = {
    memoryData: {
      type: 'line',
      data: {
        labels: [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
          37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        ],
        datasets: [
          {
            label: 'Memory Used (in MB)',
            backgroundColor: 'rgba(151, 187, 205, 0.2)',
            borderColor: 'rgba(151, 187, 205, 1)',
            pointBackgroundColor: 'rgba(151, 187, 205, 1)',
            pointBorderColor: '#fff',
            data: [
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0,
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              labelColor: function (context: any) {
                return {
                  backgroundColor: context.dataset.borderColor,
                };
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              drawOnChartArea: false,
            },
          },
          y: {
            beginAtZero: true,
            /* max: 250,*/
            ticks: {
              /* maxTicksLimit: 5,*/
              /*stepSize: Math.ceil(250 / 5),*/
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      },
    },
    diskData: {
      type: 'pie',
      data: {
        labels: ['Others', 'Apk', 'Free'],
        datasets: [
          {
            data: [],
            backgroundColor: ['#FF6384', '#13dd60ff', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#13dd60ff', '#36A2EB'],
          },
        ],
      },
      options: {
        aspectRatio: 1,
        responsive: true,
        maintainAspectRatio: true,
        radius: '100%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              labelColor: function (context: any) {
                return {
                  backgroundColor: context.dataset.borderColor,
                };
              },
            },
          },
        },
      },
    },
  };

  // ---------------------------------------------------------------------------------------

  constructor() {
    //
  }

  // ---------------------------------------------------------------------------------------

  ngOnInit(): void {
    // -----------------------------
    this.initAppListeners();
    // -----------------------------
    timer(200, 500)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: number) => {
        this.getDevideInfo(val);
      });
    // -----------------------------
  }

  // ---------------------------------------------------------------------------------------

  ngOnDestroy(): void {
    App.removeAllListeners().then();
    Browser.removeAllListeners().then();
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  // ---------------------------------------------------------------------------------------

  private initAppListeners(): void {
    App.addListener('backButton', ({ canGoBack }) => {
      this.logger.log(
        'App',
        '[backButton] event fired!!! -> canGoBack',
        canGoBack
      );
      this.exitApp();
    });

    App.addListener('appStateChange', ({ isActive }) => {
      this.logger.log(
        'App',
        '[State change] event fired!!! -> Is active?',
        isActive
      );
    });

    App.addListener('appUrlOpen', (data) => {
      this.logger.log('App', '[URL Open] event fired!!!', data);
    });

    App.addListener('appRestoredResult', (data) => {
      this.logger.log('App', '[Restored state] event fired!!!', data);
    });

    App.getLaunchUrl().then((appLaunchUrl) => {
      this.logger.log('App opened with URL: ' + appLaunchUrl);
    });

    // ----------------------------------------

    Browser.addListener('browserPageLoaded', () => {
      this.logger.log('Browser', '[browserPageLoaded] event fired!!!');
    });

    Browser.addListener('browserFinished', () => {
      this.logger.log('Browser', '[browserFinished] event fired!!!');
    });

    // ----------------------------------------

    window.addEventListener('popstate', ($event) => {
      // $event.preventDefault();
      // $event.stopPropagation();

      this.logger.debug('Window', '[popstate] event fired!!!');
    });
  }

  // ---------------------------------------------------------------------------------------

  protected getDevideInfo(timer: number): void {
    Device.getId().then((result) => {
      this.deviceInfo.id = result;
    });

    Device.getInfo().then((result) => {
      this.deviceInfo.info = result;
      // ---------------------------------------

      if (!result.name) {
        this.deviceInfo.info.name = 'unknown';
      }

      // ---------------------------------------

      if (timer % 2 === 0) {
        if (result.memUsed) {
          this.utilData.memoryData.data.datasets[0].data.unshift(
            (result.memUsed / 1048576).toFixed(2)
          );
        } else {
          this.utilData.memoryData.data.datasets[0].data.unshift(
            (Math.random() * 100).toFixed(2)
          );
        }

        if (this.utilData.memoryData.data.labels.length < 50) {
          this.utilData.memoryData.data.labels.push(
            this.utilData.memoryData.data.labels.length
          );
        } else {
          this.utilData.memoryData.data.datasets[0].data.pop();
        }

        this.utilData.memoryData.data = Object.assign(
          {},
          this.utilData.memoryData.data
        );
      }

      // ---------------------------------------
    });

    // ---------------------------------------

    if (window.DiskSpacePlugin) {
      window.DiskSpacePlugin.info(
        {
          /*
          location: 2 // 1 for SD or 2 for Internal Storage
          */
        },
        (diskSpaceInfo: any) => {
          this.deviceInfo.diskInfo.app = diskSpaceInfo.app;
          this.deviceInfo.diskInfo.total = diskSpaceInfo.total;
          this.deviceInfo.diskInfo.free = diskSpaceInfo.free;
        },
        (err: any) => {
          console.error('Error al obtener disk info 2:', err);
        }
      );
    } else {
      this.deviceInfo.diskInfo.app = 298870;
      this.deviceInfo.diskInfo.total = 98717873000;
      this.deviceInfo.diskInfo.free = 2655628000;
    }

    this.utilData.diskData.data.datasets[0].data = [
      this.getDiskSpaceInKB(
        this.deviceInfo.diskInfo.total -
          this.deviceInfo.diskInfo.app -
          this.deviceInfo.diskInfo.free
      ),
      this.getDiskSpaceInKB(this.deviceInfo.diskInfo.app),
      this.getDiskSpaceInKB(this.deviceInfo.diskInfo.free),
    ];

    this.utilData.diskData.data = Object.assign(
      {},
      this.utilData.diskData.data
    );

    Device.getBatteryInfo().then((result) => {
      this.deviceInfo.batteryInfo = result;
    });

    Device.getLanguageCode().then((result) => {
      this.deviceInfo.languageCode = result;
    });

    Device.getLanguageTag().then((result) => {
      this.deviceInfo.languageTag = result;
    });
  }

  // ---------------------------------------------------------------------------------------

  /*
  minimizeApp(): void {
    if (confirm('Do you want hide me?')) {
      App.minimizeApp().then((minimize) => {
        this.logger.log('App', 'minimizeApp() -> fired !!!', minimize);
      });
    }
  }
  */

  // ---------------------------------------------------------------------------------------

  protected exitApp(): void {
    Dialog.confirm({
      title: 'Confirm',
      message: "Are you sure you'd like to close?",
      okButtonTitle: 'Close',
      cancelButtonTitle: 'Cancel',
    }).then(({ value }) => {
      if (value) {
        App.exitApp().then((exit) => {
          this.logger.log('App', 'exitApp() -> fired !!!', exit);
        });
      }
    });
  }

  // ---------------------------------------------------------------------------------------

  protected getBatteryPercent(value: number | undefined): string {
    return value ? (value * 100).toFixed(0) : '';
  }

  protected getMemoryUsed(value: number | undefined): string {
    return value ? (value / 1048576).toFixed(2) : '0.00';
  }

  protected getDiskSpaceInGB(value: number | undefined): string {
    return value ? (value / 1024 / 1024 / 1024).toFixed(2) : '0.00';
  }

  protected getDiskSpaceInMB(value: number | undefined): string {
    return value ? (value / 1024 / 1024).toFixed(2) : '0.00';
  }

  protected getDiskSpaceInKB(value: number | undefined): string {
    return value ? (value / 1024).toFixed(2) : '0.00';
  }

  protected isInRange(
    value: number | undefined,
    min: number,
    max: number
  ): boolean {
    return value != undefined && min <= value && value <= max;
  }

  // ---------------------------------------------------------------------------------------

  protected copyToClipboard(text: string) {
    Clipboard.write({
      string: text,
    }).then(() => {
      Dialog.alert({
        title: 'Information',
        message: 'Copied to clipborad.',
        buttonTitle: 'Close',
      }).then(() => {
        //
      });
    });
  }

  // ---------------------------------------------------------------------------------------
}
