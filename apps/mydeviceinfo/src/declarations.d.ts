declare module '@coreui/utils/src';

declare module '@coreui/chartjs/dist/js/coreui-chartjs.js';

declare module '*.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value: any;
  export default value;
}

