import { createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Wrapper } from '../api/wrapper';

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
    wrapper.setDomain(name);
    dispatch(domainSet({ name }))
  }
}

export default domainSlice.reducer