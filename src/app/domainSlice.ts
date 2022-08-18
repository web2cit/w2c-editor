import { createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Wrapper } from '../api/wrapper';
import { catchallSet } from './patternsSlice';
import { fallbackSet } from './templatesSlice';
import { fetchRevisions as fetchPatternRevisions } from "../app/patternsSlice";
import { fetchRevisions as fetchTemplateRevisions } from "../app/templatesSlice";
import { batch } from 'react-redux';

interface DomainState {
  name: string | undefined;
};

const initialState: DomainState = {
  name: undefined
}

export const domainSlice = createSlice({
  name: 'domain',
  initialState,
  reducers: {
    domainSet: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      state.name = name;
    }
  }
})

// selectors
export function selectDomainName (state: RootState): string | undefined {
  return state.domain.name;
}

// actions
export const {
  domainSet
} = domainSlice.actions

export function setDomain(name: string): ThunkAction<
  void,
  RootState,
  Wrapper,
  AnyAction
> {
  return async function setDomainThunk(dispatch, _, wrapper) {
    const domainName = wrapper.setDomain(name);
    const catchallPattern = wrapper.getCatchAllPattern();
    const fallbackTemplate = wrapper.getFallbackTemplate();
    batch(() => {
      dispatch(domainSet({ name: domainName }));
      // todo: consider moving these two to this slice
      catchallPattern && dispatch(catchallSet({ pattern: catchallPattern }));
      fallbackTemplate && dispatch(fallbackSet({ template: fallbackTemplate }));
      // todo: consider having a single fetchRevisions thunk action
      dispatch(fetchPatternRevisions());
      dispatch(fetchTemplateRevisions());
    });
  }
}

export default domainSlice.reducer