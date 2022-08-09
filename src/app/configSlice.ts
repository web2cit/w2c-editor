import { Draft, EntityAdapter, EntityId, EntityState, PayloadAction, ThunkAction, AnyAction, ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { batch } from 'react-redux';
import { Wrapper } from '../api/wrapper';
import { ConfigRevision } from '../types';
import { allTargetOutputsExpired, refreshTargets, updateAllTargetOutputs } from "./targetsSlice";

// todo: instead of having some abstract definitions here implemented in
// separate config slices, we may have one single config slice, with actions
// that take a config type parameter indicating what subslice should be
// updated

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

export function getReducers<ConfigType>(adapter: EntityAdapter<ConfigType>) {
  const add = function (
    state: ConfigState<ConfigType>,
    action: PayloadAction<{ value: ConfigType }>
  ): void {
    const { value } = action.payload;
    adapter.addOne(state.data, value);
    configChangedHelper(state);
  };
  
  const remove = function (
    state: ConfigState<ConfigType>,
    action: PayloadAction<{ id: string }>
  ): void {
    const { id } = action.payload;
    if (state.data.ids.includes(id)) {
      adapter.removeOne(state.data, id);
      configChangedHelper(state);
    }
  };

  // moving makes no sense for the tests slice
  const move = function (
    state: ConfigState<ConfigType>,
    action: PayloadAction<{ id: string, index: number }>
  ): void {
    const { id, index } = action.payload;
    if (state.data.ids.includes(id)) {
      moveHelper<ConfigType>(state.data, { id,  index });
      configChangedHelper(state);
    };
  };
  
  const update = function (
    state: ConfigState<ConfigType>,
    action: PayloadAction<{ id: string, value: ConfigType }>
  ): void {
    const { id, value } = action.payload;
    if (state.data.ids.includes(id)) {
      adapter.updateOne(state.data, { id, changes: value });
      configChangedHelper(state);
    };
  }

  return { add, remove, move, update };
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

export function getThunkActionCreator<
  State,
  ActionCreator extends ActionCreatorWithPayload<any>
>(
  request: (wrapper: Wrapper, payload: ReturnType<ActionCreator>["payload"]) => Promise<void>,
  action: ActionCreator
): (payload: ReturnType<ActionCreator>["payload"]) => ThunkAction<
  void,
  State,
  Wrapper,
  // fixme
  any
> {
  return function thunkActionCreator (payload) {
    return async function thunkAction (dispatch, _, wrapper) {
      await request(wrapper, payload);
      batch(() => {
        // https://redux.js.org/style-guide/#avoid-dispatching-many-actions-sequentially
        dispatch(action(payload));
        dispatch(refreshTargets());
        dispatch(allTargetOutputsExpired());
        dispatch(updateAllTargetOutputs());
      });

      // something that the component calling the action may be interested in
      return;
    }
  }
}

// todo: maybe explain what the function type is and what ConfigType and State are
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
