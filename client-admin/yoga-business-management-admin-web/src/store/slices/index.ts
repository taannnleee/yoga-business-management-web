import { configureStore } from '@reduxjs/toolkit';
import auth from './auth';
import categories from './category';

export const reducer = configureStore({
  reducer: {
    auth,
    categories,
  },
});
