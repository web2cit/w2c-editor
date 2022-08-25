import { configureStore } from '@reduxjs/toolkit';
import domainReducer from './domainSlice';
import patternsReducer from './patternsSlice';
import templatesReducer from './templatesSlice';
import testsReducer from './testsSlice';
import targetsReducer from './targetsSlice';
import { LocalWrapper } from '../api/localWrapper';
import { Wrapper } from '../api/wrapper';
import { crossFetch } from '../api/crossFetch';

// we may have config and output slices
// config slice may be split into patterns, templates and tests slices
// they all obey to a general config slice desing
// we need this slice to easily save draft revision to local storage
// and load it after restart
// it also keeps track of available revisions

// output slice is the targets slice
// it integrates data from config slices to know what the targets are
// knows how to refresh sorting and output information

// this wrapper should implement basic functionality
// including create domain object
// fetch config files
// add config values
// etc
const wrapper: Wrapper = new LocalWrapper(
  // todo: this would only be included for bookmarklet sidebar editor
  crossFetch
);

export const store = configureStore({
  reducer: {
    domain: domainReducer,
    patterns: patternsReducer,
    templates: templatesReducer,
    tests: testsReducer,
    targets: targetsReducer
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    thunk: {
      extraArgument: wrapper
    }
  })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
