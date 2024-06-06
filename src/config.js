// @mui
import { enUS, viVN } from '@mui/material/locale';

// routes
import { PATH_DASHBOARD } from './routes/paths';

export const BASE_URL = process.env.REACT_APP_API_URL;
export const BASE_URL_WALLET = process.env.REACT_APP_API_URL_WALLET;
export const PROJECT_ID = process.env.REACT_APP_PROJECT_ID;
export const API_KEY = process.env.REACT_APP_API_KEY;

export const defaultSettings = {
  themeMode: 'light',
  themeDirection: 'ltr',
  themeContrast: 'default',
  themeLayout: 'horizontal',
  themeColorPresets: 'default',
  themeStretch: false,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg',
  },
  {
    label: 'Vietnamese',
    value: 'vn',
    systemValue: viVN,
    icon: '/assets/icons/flags/ic_flag_vn.svg',
  },
];

export const defaultLang = allLangs[0]; // English

// DEFAULT ROOT PATH
export const DEFAULT_PATH = PATH_DASHBOARD.general.app; // as '/channels'
