import appVersionJson from '../../app.version.json';
import { environment } from '../../environments/environment';
const { version } = appVersionJson;
export const appVersion =
  version + (environment.name === 'prod' ? '' : '-' + environment.name);
