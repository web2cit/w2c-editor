import { Draft, EntityAdapter, EntityId, EntityState, PayloadAction, SliceCaseReducers, ThunkAction, AnyAction } from '@reduxjs/toolkit'
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
  remove: (state: Draft<ConfigState<T>>, action: PayloadAction<{ id: string }>) => void;
  move: (state: Draft<ConfigState<T>>, action: PayloadAction<{ id: string, index: number }>) => void;
  update: (state: Draft<ConfigState<T>>, action: PayloadAction<{ id: string, value: T }>) => void;

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

// extra reducers
export function getFetchRevisionsReducers<ConfigType>() {
  const fetchRevisionsPendingReducer = function (
    state: ConfigState<ConfigType>
  ) {
    state.metadata.status = 'loading';
  };
  const fetchRevisionsFulfilledReducer = function (
    state: ConfigState<ConfigType>,
    action: PayloadAction<{ revisions: ConfigRevision[] }>
  ) {
    const { revisions } = action.payload;
    state.metadata.status = 'loaded';
    state.metadata.revisions = revisions;
  };
  const fetchRevisionsRejectedReducer = function (
    state: ConfigState<ConfigType>
  ) {
    state.metadata.status = 'idle';
  };
  return {
    fetchRevisionsPendingReducer,
    fetchRevisionsFulfilledReducer,
    fetchRevisionsRejectedReducer
  }
}

export function getLoadRevisionReducers<ConfigType>(
  adapter: EntityAdapter<ConfigType>
) {
  const loadRevisionPendingReducer = function (
    state: ConfigState<ConfigType>
  ) {
    state.data.status = "loaded";
  }

  const loadRevisionFulfilledReducer = function (
    state: ConfigState<ConfigType>,
    action: PayloadAction<{
      revid: number | null;  // may be null if we are pulling draft config from local storage
      values: ConfigType[];
    }>
  ) {
    const { revid, values } = action.payload;
    state.metadata.revid = revid;
    state.data.status = 'loaded'
    adapter.setAll(state.data, values);
  }

  const loadRevisionRejectedReducer = function (
    state: ConfigState<ConfigType>
  ) {
    //
  }

  return {
    loadRevisionPendingReducer,
    loadRevisionFulfilledReducer,
    loadRevisionRejectedReducer
  }
}

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
