export { AppContext, AppProvider, useApp } from './AppContext';
export { APP_ACTIONS } from './appActions';
export { 
  syncToSupabase, 
  syncToLocalStorage, 
  loadFromLocalStorage, 
  loadFromSupabase, 
  generateRecommendation 
} from './appHelpers';
