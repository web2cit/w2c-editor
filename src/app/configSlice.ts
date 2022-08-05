import { Draft, EntityId, EntityState, PayloadAction, SliceCaseReducers, ThunkAction, AnyAction } from '@reduxjs/toolkit'
import { Wrapper } from '../api/wrapper';
import { ConfigRevision } from '../types';

export interface ConfigState<T> {
  data: ConfigDataState<T>
  metadata: ConfigMetadataState
}

interface ConfigDataState<T> extends EntityState<T> {
  // we may be loading config values from a remote revision
  status: 'draft' | 'loading' | 'loaded';
}

interface ConfigMetadataState {
  // revid will be null for draft status
  // todo: ok to have it here in metadata?
  revid: number | null;
  // list of available revisions, undefined if not fetched yet
  revisions: ConfigRevision[] | undefined;
  status: 'idle' | 'loading' | 'loaded'
}

export interface ConfigSliceReducers<T> extends SliceCaseReducers<ConfigState<T>> {
  add: (state: Draft<ConfigState<T>>, action: PayloadAction<{ value: T }>) => void;
  // consider passing an id instead of an index in all action payloads below
  remove: (state: Draft<ConfigState<T>>, action: PayloadAction<{ index: number }>) => void;
  move: (state: Draft<ConfigState<T>>, action: PayloadAction<{ index: number, newIndex: number }>) => void;
  update: (state: Draft<ConfigState<T>>, action: PayloadAction<{ index: number, value: T }>) => void;
  // revisionsFetched: (state: Draft<ConfigState<T>>, action: PayloadAction<{ revisions: RevisionMetadata[] }>) => void;
  // revisionLoaded: (state: Draft<ConfigState<T>>, action: PayloadAction<{
  //   revid: number | null;  // may be null if we are pulling draft config from local storage
  //   values: T[];
  // }>) => void;
  // // todo: I'm not sure if it's OK to have a separate reducer for this,
  // // because it implies dispatching separate actions
  // // we should many reducers responding to the same action
  // configChanged: (state: Draft<ConfigState<T>>) => void;
}

// todo: extra reducers interface

// based on entity adapter CRUD functions
// https://redux-toolkit.js.org/api/createEntityAdapter#crud-functions
export function moveHelper<T>(
  state: EntityState<T>,
  move: {
    id: EntityId,
    index: number
  }
): void {
  const { id, index } = move;
  const oldIndex = state.ids.indexOf(id);
  if (oldIndex >= 0) {
    state.ids.splice(oldIndex, 1);
    state.ids.splice(index, 0, id);
  }  
}

// todo: read https://redux.js.org/usage/structuring-reducers/splitting-reducer-logic
// I will be using this as a helper function
export function configChangedHelper(state: Draft<ConfigState<any>>): void {
  state.data.status = "draft";
  state.metadata.revid = null;
}

// selectors
// may be undefined if not fetched yet
export type ConfigRevisionsSelector<State> = (state: State) => ConfigRevision[] | undefined;

// todo: maybe explain what the function type is and what ConfigType and State are
export type AddConfigValueThunkActionCreator<State, ConfigType> = (value: ConfigType) => ThunkAction<
  void,
  State,
  Wrapper,
  AnyAction
>

export type RemoveConfigValueThunkActionCreator<State> = (id: EntityId) => ThunkAction<
  void,
  State,
  Wrapper,
  AnyAction
>

export type UpdateConfigValueThunkActionCreator<State, ConfigType> = (id: EntityId, value: ConfigType) => ThunkAction<
  void,
  State,
  Wrapper,
  AnyAction
>

export type MoveConfigValueThunkActionCreator<State> = (id: EntityId, index: number) => ThunkAction<
  void,
  State,
  Wrapper,
  AnyAction
>

export type FetchRevisionsThunkActionCreator<State> = () => ThunkAction<
  void,
  State,
  Wrapper,
  AnyAction
>

export type LoadRevisionThunkActionCreator<State> = (revid: number) => ThunkAction<
  void,
  State,
  Wrapper,
  AnyAction
>

// todo: we may need an additional action creator type to restore draft revision

// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { PatternConfig } from '../types'
// import type { RootState } from './store'
// import { Wrapper } from '../wrapper/Wrapper';

// // Define a type for the slice state
// interface PatternsState {
//   patterns: PatternConfig[];
// }

// // Define the initial state using that type
// const initialState: PatternsState = {
//   patterns: {

//   };
//   templates: {
//     paths: [],
//     entitites: {}
//     revisions: {
        
//     }
//   }
//   tests:
// }

// export const configSlice = createSlice({
//   name: 'config',
//   // `createSlice` will infer the state type from the `initialState` argument
//   initialState,
//   reducers: {
//     add: (state, action: PayloadAction<{ pattern: PatternConfig }>) => {
      
//     },
//     remove: (state, action: PayloadAction<{ index: number }>) => {
//       state.patterns.splice(action.payload.index, 1);
//     },
//     move: (
//       state,
//       action: PayloadAction<{ index: number; newIndex: number }>
//     ) => {
//       const { index, newIndex } = action.payload;
//       const pattern = state.patterns.splice(index, 1)[0];
//       if (pattern !== undefined) {
//         state.patterns.splice(newIndex, 0, pattern);
//       };
//     },
//     update: (
//       state,
//       action: PayloadAction<{ index: number; pattern: PatternConfig }>
//     ) => {
//       const { index, pattern } = action.payload;
//       state.patterns[index] = pattern;
//     }
//   },
//   // The `extraReducers` field lets the slice handle actions defined elsewhere,
//   // including actions generated by createAsyncThunk or in other slices.
//   extraReducers: (builder) => {
//     builder
//       .addCase(add.pending, (state) => {
//         // state.status = 'loading';
//       })
//       .addCase(add.fulfilled, (state, action) => {
//         // mutable updates inside createSlice are converted to immutable updates
//         // by Immer

//         // todo: how should we deal with fallback pattern
//         state.patterns.push(action.payload.pattern);
//       })
//       .addCase(add.rejected, (state) => {
//         // state.status = 'failed';
//       });

// })

// // todo: we don't need to handle loading and rejected states in the global state
// // we can just leave this to the component calling the async action
// // hence, consider creating a thunk manually instead
// export const add = createAsyncThunk<
//   // Return type of the payload creator
//   { pattern: PatternConfig },
//   // First argument to the payload creator
//   { pattern: PatternConfig },
//   {
//     // Optional fields for defining thunkApi field types
//     extra: {
//       wrapper: Wrapper
//     }
//   }
// >('patterns/add', async ( { pattern }, thunkApi) => {
//     await thunkApi.extra.wrapper.addPattern(pattern);
    
//     // about dispatching many actions in a row:
//     // https://redux.js.org/style-guide/#avoid-dispatching-many-actions-sequentially
//     // todo: is it ok to dispatch refresh sorting and outputs here?
    
//     // import actions from corresponding slice files
//     thunkApi.dispatch(refresSort())
//     // thunkApi.dispatch(refreshOutput())  // call from refreshSort...
    
//     // The value we return becomes the `fulfilled` action payload
//     return { pattern };
//   }
// );



// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

// export default counterSlice.reducer

// // todo: with this approach we will have two sources of truth: the wrapper
// // and the state
// // isn't this what happens anyway when we fetch posts from a remote server
// // but still keep them locally?


// // todo: what is the right place for config metadata? here? or on a separate file?

// // config files may be fetched and loaded in batch


// // we don't want to update outputs each time; just once per batch