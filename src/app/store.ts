import { configureStore } from '@reduxjs/toolkit'

// this wrapper should implement basic functionality
// including create domain object
// fetch config files
// add config values
// etc
const wrapper = new Wrapper();

export const store = configureStore({
  reducer: {},
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    thunk: {
      extraArgument: { wrapper }
    }
  })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
