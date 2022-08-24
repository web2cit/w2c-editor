import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TestConfig } from '../types'
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

interface TestsState extends ConfigState<TestConfig> {
}

const testsAdapter = createEntityAdapter<TestConfig>({
  selectId: test => test.path
})

const initialState: TestsState = {
  data: testsAdapter.getInitialState({
    status: 'idle'
  }),
  metadata: {
    revid: 0,
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
} = getLoadRevisionReducers(testsAdapter);

export const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    ...getReducers(testsAdapter)
  },
  extraReducers: {
    'tests/fetchRevisions/pending': fetchRevisionsPendingReducer,
    'tests/fetchRevisions/fulfilled': fetchRevisionsFulfilledReducer,
    'tests/fetchRevisions/rejected': fetchRevisionsRejectedReducer,
    'tests/loadRevision/pending': loadRevisionPendingReducer,
    'tests/loadRevision/fulfilled': loadRevisionFulfilledReducer,
    'tests/loadRevision/rejected': loadRevisionRejectedReducer
  },
})

// selectors
export const {
//   selectAll: selectAllTests,
  selectById: selectTestsByPath,
} = testsAdapter.getSelectors<RootState>(state => state.tests.data);

export const selectTestRevisions: ConfigRevisionsSelector<RootState> = (state) => {
  return state.tests.metadata.revisions;
}

export const selectTestsRevid = (state: RootState) => {
  return state.tests.metadata.revid;
}

// action creators
export const {
  add: testAdded,
  remove: testRemoved,
//   move: testMoved,
  update: testUpdated,
} = testsSlice.actions

// thunk action creators
export const addTest = getThunkActionCreator<
  RootState,
  typeof testAdded
>(
  async (wrapper, payload) => wrapper.addTest(payload.value),
  testAdded
);

export const removeTest = getThunkActionCreator<
  RootState,
  typeof testRemoved
>(
  async (wrapper, payload) => wrapper.removeTest(payload.id),
  testRemoved
);

export const updateTest = getThunkActionCreator<
  RootState,
  typeof testUpdated
>(
  async (wrapper, payload) => wrapper.updateTest(payload.id, payload.value),
  testUpdated
);

// I will mimick behavior resulting from createAsyncThunk but not use it
// because I need to batch dispatch multiple actions/thunk actions along with
// the revisionsFetched action

export const fetchRevisions: FetchRevisionsThunkActionCreator<RootState> = () => {
  return async function fetchRevisionsThunk(dispatch, _, wrapper) {
    dispatch({
      type: "tests/fetchRevisions/pending"
    });
    try {
      const revisions = await wrapper.fetchConfigRevisions("tests");
      batch(() => {
        // apparently I didn't need batch-dispatching actions anyways?
        dispatch({
          type: "tests/fetchRevisions/fulfilled",
          payload: { revisions }
        });
      });
    } catch {
      dispatch({
        type: "tests/fetchRevisions/rejected"
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
      type: "tests/loadRevision/pending"
    });
    try {
      const tests = await wrapper.loadTestsRevision(revid);
      batch(() => {
        // todo: these actions ought to be typed
        dispatch({
          type: "tests/loadRevision/fulfilled",
          payload: { revid, values: tests }
        });
        dispatch(refreshTargets());
        dispatch(allTargetOutputsExpired());
        dispatch(updateAllTargetOutputs());
      });
    } catch {
      dispatch({
        type: "tests/loadRevision/rejected"
      });
    }
  }
}

export default testsSlice.reducer