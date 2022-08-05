import { Action, ActionCreatorWithoutPayload, AnyAction, createAsyncThunk, createEntityAdapter, createSlice, EntityId, EntityState, PayloadAction, Update } from '@reduxjs/toolkit'
import { ConfigRevision, PatternConfig } from '../types'
import type { RootState } from './store'
import { Wrapper } from '../api/wrapper';
import { ThunkAction } from 'redux-thunk'
import { Root } from 'react-dom/client';
import { 
  ConfigState,
  ConfigSliceReducers,
  moveHelper,
  configChangedHelper,
  AddConfigValueThunkActionCreator,
  RemoveConfigValueThunkActionCreator,
  UpdateConfigValueThunkActionCreator,
  MoveConfigValueThunkActionCreator,
  ConfigRevisionsSelector,
  FetchRevisionsThunkActionCreator,
  LoadRevisionThunkActionCreator
} from "./configSlice";
import { allTargetOutputsExpired, refreshTargets, updateAllTargetOutputs } from "./targetsSlice";
import { batch } from "react-redux";

interface PatternsState extends ConfigState<PatternConfig> {}

// we may want to keep values above as { ids: [], entities: {} }
const patternsAdapter = createEntityAdapter<PatternConfig>({
  // 
  selectId: pattern => pattern.pattern ?? ''
})

// Define the initial state using that type
const initialState: PatternsState = {
  data: patternsAdapter.getInitialState({
    status: 'draft'
  }),
  metadata: {
    revid: null,
    revisions: undefined,
    status: 'idle'
  }
}

// have a function that makes this reducers object
// I'll need to pass it the adapter
const patternsReducers: ConfigSliceReducers<PatternConfig> = {
  add: (state, action) => {
    const { value } = action.payload;
    // I have the state managed by the adapter nested one-level down in the
    // config slice state (i.e., patterns state)
    // Will that be a problem when returning the modified state?
    patternsAdapter.addOne(state.data, value);
    configChangedHelper(state);
  },
  remove: (state, action) => {
    const { index } = action.payload;
    const pattern = state.data.ids[index];
    if (pattern !== undefined) {
      patternsAdapter.removeOne(state.data, pattern);
      configChangedHelper(state);
    };
  },
  move: (state, action) => {
    const { index, newIndex } = action.payload;
    const pattern = state.data.ids[index];
    if (pattern !== undefined) {
      moveHelper<PatternConfig>(state.data, { id: pattern, index: newIndex });
      configChangedHelper(state);
    };
  },
  update: (state, action) => {
    const { index, value } = action.payload;
    const pattern = state.data.ids[index];
    if (pattern !== undefined) {
      patternsAdapter.updateOne(state.data, { id: pattern, changes: value });
      configChangedHelper(state);
    };
  },
}

export const patternsSlice = createSlice({
  name: 'patterns',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: patternsReducers,
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  
  // todo: define type in config slice file
  extraReducers: {
    // alternatively, create action creators for these actions and use the builder notation
    // https://redux-toolkit.js.org/api/createSlice#the-extrareducers-builder-callback-notation
    'patterns/fetchRevisions/pending': (state, action) => {
      state.metadata.status = 'loading';
    },
    'patterns/fetchRevisions/fulfilled': (state, action: PayloadAction<{ revisions: ConfigRevision[] }>) => {
      const { revisions } = action.payload;
      state.metadata.status = 'loaded';
      state.metadata.revisions = revisions;
    },
    // I may not need this reducer
    'patterns/fetchRevisions/rejected': (state) => {
      state.metadata.status = 'idle';
    },

    'patterns/loadRevision/pending': (state) => {
      state.data.status = "loaded";
    },
    'patterns/loadRevision/fulfilled': (state, action: PayloadAction<{
      revid: number | null;  // may be null if we are pulling draft config from local storage
      values: PatternConfig[];
    }>) => {
      const { revid, values } = action.payload;
      state.metadata.revid = revid;
      state.data.status = 'loaded'
      patternsAdapter.setAll(state.data, values);
    },
    'patterns/loadRevision/rejected': (state) => {}
  },
})

// selectors
export const {
  selectAll: selectAllPatterns,
  selectById: selectPatternByPath,
} = patternsAdapter.getSelectors<RootState>(state => state.patterns.data);

export const selectPatternRevisions: ConfigRevisionsSelector<RootState> = (state) => {
  return state.patterns.metadata.revisions;
}

// actions
export const {
  add: patternAdded,
  remove: patternRemoved,
  move: patternMoved,
  update: patternUpdated,
} = patternsSlice.actions

// todo: note that all add/remove/move/update patterns below folow the same
// shape. they only differ in the wrapper method they use, one of the actions
// they dispatch, and maybe the value they return
// consider having generator of thunk action creators, to avoid repetition
export const addPattern: AddConfigValueThunkActionCreator<RootState, PatternConfig> = function (value) {
  return async function addPatternThunk (dispatch, _, wrapper) {
    await wrapper.addPattern(value);
    // new template means new path
    // trigger targets refresh
    // and wipe translation outputs (ideally by pattern)
    batch(() => {
      // fixme: how do we prevent dispatching multiple actions?
      // about dispatching many actions in a row:
      // https://redux.js.org/style-guide/#avoid-dispatching-many-actions-sequentially

      dispatch(patternAdded({ value }));
      
      // move the following three together out to the targets slice?
      dispatch(refreshTargets());
      dispatch(allTargetOutputsExpired());
      // and ask for outputs recalculation
      // maybe just for the current selected target
      // maybe updating for current selected target should be automatic in the targets slice
      // i.e., do not update globally if target selected
      // maybe yes respect defined outputs
      dispatch(updateAllTargetOutputs());
    });

    // something that the component calling the action may be interested in
    return;
  }
}

export const removePattern: RemoveConfigValueThunkActionCreator<RootState> = function(id) {
  return async function removePatternThunk (dispatch, _, wrapper) {
    // fixme: as string...
    await wrapper.removePattern(id as string);
    batch(() => {
      // fixme: have the patternRemoved reducer take id instead of index
      dispatch(patternRemoved({ index: 1 }));
      dispatch(refreshTargets());
      dispatch(allTargetOutputsExpired());
      dispatch(updateAllTargetOutputs());
    });
    return;
  }
}

export const movePattern: MoveConfigValueThunkActionCreator<RootState> = function(id, index) {
  return async function movePatternThunk (dispatch, _, wrapper) {
    // fixme: as string...
    await wrapper.movePattern(id as string, index);
    batch(() => {
      // fixme: have the patternRemoved reducer take id instead of index
      dispatch(patternMoved({ index: 1, newIndex: index }));
      dispatch(refreshTargets());
      dispatch(allTargetOutputsExpired());
      dispatch(updateAllTargetOutputs());
    });
    return;
  }
};

export const updatePattern: UpdateConfigValueThunkActionCreator<RootState, PatternConfig> = function(id, value) {
  return async function updatePatternThunk (dispatch, _, wrapper) {
    // fixme: as string...
    await wrapper.updatePattern(id as string, value);
    batch(() => {
      // fixme: have the patternUpdated reducer take id instead of index
      // todo: consider passing a changes object instead of value
      dispatch(patternUpdated({ index: 1, value: value}));
      dispatch(refreshTargets());
      dispatch(allTargetOutputsExpired());
      dispatch(updateAllTargetOutputs());
    });
    return;
  }
};

// I will mimick behavior resulting from createAsyncThunk but not use it
// because I need to batch dispatch multiple actions/thunk actions along with
// the revisionsFetched action

export const fetchRevisions: FetchRevisionsThunkActionCreator<RootState> = () => {
  return async function fetchRevisionsThunk(dispatch, _, wrapper) {
    dispatch({
      type: "patterns/fetchRevisions/pending"
    });
    try {
      const revisions = await wrapper.fetchConfigRevisions("patterns");
      batch(() => {
        // apparently I didn't need batch-dispatching actions anyways?
        dispatch({
          type: "patterns/fetchRevisions/fulfilled",
          payload: { revisions }
        })
    });
    } catch {
      dispatch({
        type: "patterns/fetchRevisions/rejected"
        // todo: what else does the rejected action provided by createAsyncThunk
        // include?
      });
      // todo: should we return something to the component which dispatched the
      // thunk action?
    }
  }
}

// const fetchRevisions = createAsyncThunk<
//   // Return type of the payload creator
//   ConfigRevision[],
//   // First argument to the payload creator
//   undefined,
//   {
//     // Optional fields for defining thunkApi field types
//     extra: {
//       wrapper: Wrapper
//     }
//   }
// >(
//   'patterns/revisions',
//   async function (_, { extra }) {
//     const revisions = await extra.wrapper.fetchConfigRevisions("patterns");
//     // The value we return becomes the `fulfilled` action payload
//     return revisions;
//     // note: this will dispatch the fulfilled action; the problem with
//     // createAsyncThunk is that it doesn't seem to allow batch-dispatching
//     // the refreshTargets action thunk...
//   }
// );

const loadRevision: LoadRevisionThunkActionCreator<RootState> = (revid) => {
  return async function loadRevisionThunk(dispatch, _, wrapper) {
    dispatch({
      type: "patterns/loadRevision/pending"
    });
    try {
      const patterns = await wrapper.loadConfigRevision<PatternConfig>("pattern", revid);
      batch(() => {
        // todo: these actions ought to be typed
        dispatch({
          type: "patterns/loadRevision/fulfilled",
          payload: { revid, values: patterns }
        });
        dispatch(refreshTargets());
        dispatch(allTargetOutputsExpired());
        dispatch(updateAllTargetOutputs());
      });
    } catch {
      dispatch({
        type: "patterns/loadRevision/rejected"
      });
    }
  }
}

export default patternsSlice.reducer