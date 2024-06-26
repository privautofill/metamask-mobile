import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../../reducers';

export const NUMBER_OF_REJECTIONS_THRESHOLD = 3;
export const REJECTION_THRESHOLD_IN_MS = 30000;
const ONE_MINUTE_IN_MS = 60000;

export interface DomainState {
  rejections: number;
  lastRejection: number;
}

export interface DappSpamFilterState {
  domains: {
    [key: string]: DomainState;
  };
}

export const initialState: DappSpamFilterState = {
  domains: {},
};

const name = 'dappSpamFilter';

const slice = createSlice({
  name,
  initialState,
  reducers: {
    onRPCRequestRejectedByUser(
      state: DappSpamFilterState,
      action: PayloadAction<string>,
    ) {
      const domain = action.payload;
      const currentState = state.domains[domain] || {
        rejections: 0,
        lastRejection: 0,
      };
      const currentTime = Date.now();
      let newRejections = currentState.rejections;
      let newSpamPrompt = false;

      const isUnderThreshold =
        currentTime - currentState.lastRejection < REJECTION_THRESHOLD_IN_MS;

      newRejections = isUnderThreshold ? newRejections + 1 : 1;

      state.domains[domain] = {
        rejections: newRejections,
        lastRejection: currentTime,
      };
    },
    resetDappSpamState: (
      state: DappSpamFilterState,
      action: PayloadAction<string>,
    ) => {
      const domain = action.payload;
      delete state.domains[domain];
    },
  },
});

// Actions
const { actions, reducer } = slice;
export default reducer;
export const {
  onRPCRequestRejectedByUser,
  resetDappSpamState,
  resetSpamPrompt,
} = actions;

// Selectors
const selectDomainState = (state: RootState, domain: string) =>
  state[name].domains[domain];

export const isDappBlockedForRPCRequests = (
  state: RootState,
  domain: string,
) => {
  const domainState = selectDomainState(state, domain);
  if (!domainState) {
    return false;
  }
  const currentTime = Date.now();
  const { rejections, lastRejection } = domainState;
  const isWithinOneMinute = currentTime - lastRejection <= ONE_MINUTE_IN_MS;

  return rejections >= NUMBER_OF_REJECTIONS_THRESHOLD && isWithinOneMinute;
};

export const selectOriginAtSpamThreshold = (state: RootState, domain: string) => {
  const domainState = selectDomainState(state, domain);
  if (!domainState) {
    return false;
  }
  const currentTime = Date.now();
  const isUnderThreshold =
    currentTime - domainState.lastRejection < REJECTION_THRESHOLD_IN_MS;
  const hasReachedThreshold =
    domainState.rejections >= NUMBER_OF_REJECTIONS_THRESHOLD && isUnderThreshold;

  return hasReachedThreshold;
};
