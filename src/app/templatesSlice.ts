import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TemplateConfig } from '../types'
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

interface TemplatesState extends ConfigState<TemplateConfig> {
  // todo: consider moving to the domain slice
  fallback?: TemplateConfig;
}

const templatesAdapter = createEntityAdapter<TemplateConfig>({
  selectId: template => template.path ?? ''
})

const initialState: TemplatesState = {
  data: templatesAdapter.getInitialState({
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
} = getLoadRevisionReducers(templatesAdapter);

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    ...getReducers(templatesAdapter),
    fallbackSet: (
      state,
      action: PayloadAction<{ template: TemplateConfig }>
    ) => {
      const { template } = action.payload;
      state.fallback = template;
    }
  },
  extraReducers: {
    'templates/fetchRevisions/pending': fetchRevisionsPendingReducer,
    'templates/fetchRevisions/fulfilled': fetchRevisionsFulfilledReducer,
    'templates/fetchRevisions/rejected': fetchRevisionsRejectedReducer,
    'templates/loadRevision/pending': loadRevisionPendingReducer,
    'templates/loadRevision/fulfilled': loadRevisionFulfilledReducer,
    'templates/loadRevision/rejected': loadRevisionRejectedReducer
  },
})

// selectors
export const {
  selectAll: selectAllTemplates,
  selectById: selectTemplateByPath,
} = templatesAdapter.getSelectors<RootState>(state => state.templates.data);

export const selectTemplateRevisions: ConfigRevisionsSelector<RootState> = (state) => {
  return state.templates.metadata.revisions;
}

export function selectFallbackTemplate(
  state: RootState
): TemplateConfig | undefined {
  return state.templates.fallback;
}

// action creators
export const {
  add: templateAdded,
  remove: templateRemoved,
  move: templateMoved,
  update: templateUpdated,
  fallbackSet
} = templatesSlice.actions

// thunk action creators
export const addTemplate = getThunkActionCreator<
  RootState,
  typeof templateAdded
>(
  async (wrapper, payload) => wrapper.addTemplate(payload.value),
  templateAdded
);

export const removeTemplate = getThunkActionCreator<
  RootState,
  typeof templateRemoved
>(
  async (wrapper, payload) => wrapper.removeTemplate(payload.id),
  templateRemoved
);

export const moveTemplate = getThunkActionCreator<
  RootState,
  typeof templateMoved
>(
  async (wrapper, payload) => wrapper.moveTemplate(payload.id, payload.index),
  templateMoved
);
    
export const updateTemplate = getThunkActionCreator<
  RootState,
  typeof templateUpdated
>(
  async (wrapper, payload) => wrapper.updateTemplate(payload.id, payload.value),
  templateUpdated
);

// I will mimick behavior resulting from createAsyncThunk but not use it
// because I need to batch dispatch multiple actions/thunk actions along with
// the revisionsFetched action

export const fetchRevisions: FetchRevisionsThunkActionCreator<RootState> = () => {
  return async function fetchRevisionsThunk(dispatch, _, wrapper) {
    dispatch({
      type: "templates/fetchRevisions/pending"
    });
    try {
      const revisions = await wrapper.fetchConfigRevisions("templates");
      batch(() => {
        // apparently I didn't need batch-dispatching actions anyways?
        dispatch({
          type: "templates/fetchRevisions/fulfilled",
          payload: { revisions }
        });
      });
    } catch {
      dispatch({
        type: "templates/fetchRevisions/rejected"
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
      type: "templates/loadRevision/pending"
    });
    try {
      const templates = await wrapper.loadTemplatesRevision(revid);
      batch(() => {
        // todo: these actions ought to be typed
        dispatch({
          type: "templates/loadRevision/fulfilled",
          payload: { revid, values: templates }
        });
        dispatch(refreshTargets());
        dispatch(allTargetOutputsExpired());
        dispatch(updateAllTargetOutputs());
      });
    } catch {
      dispatch({
        type: "templates/loadRevision/rejected"
      });
    }
  }
}

export default templatesSlice.reducer