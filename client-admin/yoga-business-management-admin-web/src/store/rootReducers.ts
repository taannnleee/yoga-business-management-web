import { combineReducers } from 'redux';
import auth from './slices/auth';
import categories from './slices/category';

const rootReducer = combineReducers({
  auth,
  categories,
});

export default rootReducer;
