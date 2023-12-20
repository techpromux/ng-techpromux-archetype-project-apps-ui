import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  Device,
  DeviceId,
  DeviceInfo,
  BatteryInfo,
  GetLanguageCodeResult,
  LanguageTag,
} from '@capacitor/device';

import { timer, Subject, takeUntil } from 'rxjs';

import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { randomBytes } from 'crypto';
import { Dialog } from '@capacitor/dialog';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
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
  } = {};

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
        labels: ['Used', 'Free Space'],
        datasets: [
          {
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB'],
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
      .subscribe((val) => {
        this.getDevideInfo();
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

  getDevideInfo(): void {
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

      if (!result.realDiskFree) {
        this.deviceInfo.info.realDiskFree = 50000000000;
      }

      if (!result.realDiskTotal) {
        this.deviceInfo.info.realDiskTotal = 115000000000;
      }

      if (
        this.deviceInfo.info.realDiskFree &&
        this.deviceInfo.info.realDiskTotal
      ) {
        this.utilData.diskData.data.datasets[0].data = [
          this.getDiskSpaceInGB(
            this.deviceInfo.info.realDiskTotal -
              this.deviceInfo.info.realDiskFree
          ),
          this.getDiskSpaceInGB(this.deviceInfo.info.realDiskFree),
        ];
      }

      this.utilData.diskData.data = Object.assign(
        {},
        this.utilData.diskData.data
      );
      // ---------------------------------------

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

      // ---------------------------------------
    });

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

  exitApp(): void {
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

  getBatteryPercent(value: number | undefined): string {
    return value ? (value * 100).toFixed(0) : '';
  }

  getMemoryUsed(value: number | undefined): string {
    return value ? (value / 1048576).toFixed(2) : '0.00';
  }

  getDiskSpaceInGB(value: number | undefined): string {
    return value ? (value / 1024 / 1024 / 1024).toFixed(2) : '0.00';
  }

  isInRange(value: number | undefined, min: number, max: number): boolean {
    return value != undefined && min <= value && value <= max;
  }
}
