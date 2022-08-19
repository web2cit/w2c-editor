import type { RootState } from './store'
import { AnyAction, createEntityAdapter, createSlice, EntityState, PayloadAction, ThunkAction, Update } from '@reduxjs/toolkit'
import { Target, TargetResult, TemplatePath } from '../types';
import { Wrapper } from '../api/wrapper';

type PatternValue = string | null;

// alternatively we may have target selectors elsewhere, maybe in the 
// stores file
// and have an outputs slice instead

// having a list of targets in the state may also serve to separate
// between configured paths and valid paths


// maybe just trust the wrapper to get outputs and sortingsn

export interface TargetsState extends EntityState<Target> {
  // currently selected target
  selection: string | undefined;
  // todo: consider having a current target property indicating the target
  // currently shown by the browser
};

// we don't care about the order of the targets
const targetsAdapter = createEntityAdapter<Target>({
  selectId: (target) => target.path
});

const initialState: TargetsState = targetsAdapter.getInitialState({
  selection: undefined
})

const targetsSlice = createSlice({
  name: 'targets',
  initialState: initialState,
  reducers: {
    targetSelected: (state, action: PayloadAction<{ path: string }>) => {
      const { path } = action.payload;
      state.selection = path;
    },
    // Can pass adapter functions directly as case reducers.  Because we're passing this
    // as a value, `createSlice` will auto-generate the `bookAdded` action type / creator
    targetsRefreshed: targetsAdapter.setAll,
    // targetsRefreshed(state, action: PayloadAction<{ targets: Target[] }>) {
    //   targetsAdapter.setAll(state, action.payload.targets);
    // }
    allTargetOutputsExpired: (state) => {
      Object.values(state.entities).forEach((target) => {
        // entities values cannot be undefined
        // see https://github.com/reduxjs/redux-toolkit/issues/930
        target!.preferredResult = undefined;
        target!.results.forEach((result) => {
          result.output = undefined;
        });
      });
    },
    targetOutputsExpiredByPath: (
      state,
      // todo: I think I read somewhere that it's better to have action
      // action payloads as objects
      action: PayloadAction<{ path: string }>
    ) => {
      const { path } = action.payload;
      const target = state.entities[path];
      if (target !== undefined) {
        target.preferredResult = undefined;
        target.results.forEach((result) => {
          result.output = undefined;
        });
      }
    },
    // allTargetOutputsUpdated: (
    //   state,
    //   action: PayloadAction<{ updates: Update<Target>[] }>
    // ) => {
    //   const { updates } = action.payload;
    //   targetsAdapter.updateMany(state, updates);
    // },
    targetOutputsUpdatedByPath: (
      state,
      action: PayloadAction<{ path: string, results: TargetResult[] }>
    ) => {
      const { path, results } = action.payload;

      // todo: consider passing this into the action (or removing the prop)
      const preferredResult = results.find(
        (result) => result.output?.applicable
      )?.template;
  
      const update: Update<Target> = {
        id: path,
        changes: {
          results,
          preferredResult
        }
      };
      targetsAdapter.updateOne(state, update);
    }
  },
})

// Selectors

// Export the customized selectors for this adapter using `getSelectors`
export const {
  selectAll: selectAllTargets,
  selectById: selectTargetByPath,
  selectIds: selectPaths,
} = targetsAdapter.getSelectors<RootState>(state => state.targets);

// other selectors
export function selectTargetSelection(state: RootState): string | undefined {
  return state.targets.selection;
};

export function selectTargetResultByPathAndTemplate(
  state: RootState,
  path: string,
  template: TemplatePath
): TargetResult | undefined {
  const target = selectTargetByPath(state, path);
  let result;
  if (target !== undefined) {
    result = target.results.find((result) => result.template === template);
  }
  return result;
}

// export const selectPostsByUser = createSelector(
//   [selectAllPosts, (state, userId) => userId],
//   (posts, userId) => posts.filter(post => post.user === userId)
// )

// actions

const {
  targetsRefreshed,
  targetOutputsUpdatedByPath,
} = targetsSlice.actions;
export const {
  allTargetOutputsExpired,
  targetSelected
} = targetsSlice.actions;

// Initially, I wanted to have how paths are sorted into patterns in the state
// because I thought I couldn't have access to the w2c wrapper from the
// components.
// However, that may not be true: we can use the w2c wrapper via a thunk; thunks
// don't have to update the state necessarily.
// Yet, it may still be useful to keep an up-to-date list of targets in the
// state, with their sorting into patterns and their outputs.
// Including their outputs ensures we won't keep outputs for no longer needed
// targets in a seperate slice.
export function refreshTargets(): ThunkAction<
  void,
  RootState,
  Wrapper,
  ReturnType<typeof targetsRefreshed>  // or AnyAction
> {
  return async function refreshTargetsThunk(dispatch, _, wrapper) {
    // getting targets from the wrapper should be immediate
    // we probably don't need to set some loading state at the beginning
    // what should we do in case of errors, though?
    // and will the components calling this action expect sth in return?
    const targets: Target[] = wrapper.getTargets();
    dispatch(targetsRefreshed(targets));
  }
}

// todo: we may rename this as updateTargetOutputs and have it update either
// all targets or the target selected only (if any)
// alternatively, we may have a updateSelectedTargetOutputs method (or rename
// the updateTargetOutputsByPath below)
export function updateAllTargetOutputs(): ThunkAction<
  void,
  RootState,
  Wrapper,
  AnyAction
> {
  return async function updateAllTargetOutputsThunk(dispatch, getState, wrapper) {
    // get target paths from the state
    const paths = selectPaths(getState());
    
    // make target outputs undefined
    // or ignore targets whose outputs object is defined already

    // iterate through paths and request translation
    // call dispatch one by one, so we results are shown gradually
    // we may give templates path to try, or just pattern (so it does not calculate again)
    paths.forEach((path) => {
      // fixme: as string...
      dispatch(updateTargetOutputsByPath(path as string));
    });
  }
}

// this one could be made via createAsyncThunk, because we could benefit
// from the loading/success/failure approach
export function updateTargetOutputsByPath(path: string): ThunkAction<
  void,
  RootState,
  Wrapper,
  ReturnType<typeof targetOutputsUpdatedByPath>
> {
  return async function updateTargetOutputsByPathThunk(dispatch, _, wrapper) {
    // check if path is in targets state?
    
    // sorting paths into patterns does take some effort (negligible?)
    // force the pattern group into the translate method so that it is not
    // calculated again
    
    // todo: consider having wrapper's translate return the preferred result
    const results = await wrapper.translate(path);
    
    dispatch(targetOutputsUpdatedByPath({ path, results }));
  }
};

export default targetsSlice.reducer;
