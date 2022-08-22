import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CatchallPatternConfig, PatternConfig } from '../types'
import type { RootState } from './store'
import { 
  ConfigState,
  ConfigRevisionsSelector,
  getThunkActionCreator,
  FetchRevisionsThunkActionCreator,
  LoadRevisionThunkActionCreator,
  getFetchRevisionsReducers,
  getLoadRevisionReducers,
  getReducers
} from "./configSlice";
import { batch } from "react-redux";
import { allTargetOutputsExpired, refreshTargets, updateAllTargetOutputs } from "./targetsSlice";

interface PatternsState extends ConfigState<PatternConfig> {
  // todo: consider moving this to the domain slice
  catchall?: CatchallPatternConfig;
}

const patternsAdapter = createEntityAdapter<PatternConfig>({
  selectId: pattern => pattern.pattern ?? ''
})

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

const {
  fetchRevisionsPendingReducer,
  fetchRevisionsFulfilledReducer,
  fetchRevisionsRejectedReducer
} = getFetchRevisionsReducers();

const {
  loadRevisionPendingReducer,
  loadRevisionFulfilledReducer,
  loadRevisionRejectedReducer
} = getLoadRevisionReducers(patternsAdapter);

export const patternsSlice = createSlice({
  name: 'patterns',
  initialState,
  reducers: {
    ...getReducers(patternsAdapter),
    catchallSet: (
      state,
      action: PayloadAction<{ pattern: CatchallPatternConfig }>
    ) => {
      const { pattern } = action.payload;
      state.catchall = pattern;
    }
  },
  extraReducers: {
    'patterns/fetchRevisions/pending': fetchRevisionsPendingReducer,
    'patterns/fetchRevisions/fulfilled': fetchRevisionsFulfilledReducer,
    'patterns/fetchRevisions/rejected': fetchRevisionsRejectedReducer,
    'patterns/loadRevision/pending': loadRevisionPendingReducer,
    'patterns/loadRevision/fulfilled': loadRevisionFulfilledReducer,
    'patterns/loadRevision/rejected': loadRevisionRejectedReducer
  },
})

// selectors
export const {
  selectAll: selectAllPatterns,
  selectById: selectPatternByExpression,
} = patternsAdapter.getSelectors<RootState>(state => state.patterns.data);

export const selectPatternRevisions: ConfigRevisionsSelector<RootState> = (state) => {
  return state.patterns.metadata.revisions;
}

export function selectCatchallPattern(
  state: RootState
): CatchallPatternConfig | undefined {
  return state.patterns.catchall;
};

// action creators
export const {
  add: patternAdded,
  remove: patternRemoved,
  move: patternMoved,
  update: patternUpdated,
  catchallSet
} = patternsSlice.actions

// thunk action creators
export const addPattern = getThunkActionCreator<
  RootState,
  typeof patternAdded
>(
  async (wrapper, payload) => wrapper.addPattern(payload.value),
  patternAdded
);

export const removePattern = getThunkActionCreator<
  RootState,
  typeof patternRemoved
>(
  async (wrapper, payload) => wrapper.removePattern(payload.id),
  patternRemoved
);

export const movePattern = getThunkActionCreator<
  RootState,
  typeof patternMoved
>(
  async (wrapper, payload) => wrapper.movePattern(payload.id, payload.index),
  patternMoved
);
    
export const updatePattern = getThunkActionCreator<
  RootState,
  typeof patternUpdated
>(
  async (wrapper, payload) => wrapper.updatePattern(payload.id, payload.value),
  patternUpdated
);

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

export const loadRevision: LoadRevisionThunkActionCreator<RootState> = (revid) => {
  return async function loadRevisionThunk(dispatch, _, wrapper) {
    dispatch({
      type: "patterns/loadRevision/pending"
    });
    try {
      const patterns = await wrapper.loadPatternsRevision(revid);
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