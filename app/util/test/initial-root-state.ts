import type { RootState } from '../../reducers';
import type { EngineState } from '../../core/Engine';
import { initialState as initialFiatOrdersState } from '../../reducers/fiatOrders';
import { initialState as initialSecurityState } from '../../reducers/security';
import { initialState as initialInpageProvider } from '../../core/redux/slices/inpageProvider';
import { initialState as initialSmartTransactions } from '../../core/redux/slices/smartTransactions';
import { initialState as transactionMetrics } from '../../core/redux/slices/transactionMetrics';
import { initialState as dappSpamFilter } from '../../core/redux/slices/dappSpamFilter';
import initialBackgroundState from './initial-background-state.json';

// Cast because TypeScript is incorrectly inferring the type of this JSON object
// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const backgroundState: EngineState = initialBackgroundState as any;

const initialRootState: RootState = {
  legalNotices: undefined,
  collectibles: undefined,
  engine: { backgroundState },
  privacy: undefined,
  bookmarks: undefined,
  browser: undefined,
  modals: undefined,
  settings: undefined,
  alert: undefined,
  transaction: undefined,
  smartTransactions: initialSmartTransactions,
  user: {},
  wizard: undefined,
  onboarding: undefined,
  notification: undefined,
  swaps: undefined,
  fiatOrders: initialFiatOrdersState,
  infuraAvailability: undefined,
  navigation: undefined,
  networkOnboarded: undefined,
  security: initialSecurityState,
  signatureRequest: undefined,
  sdk: {
    connections: {},
    approvedHosts: {},
    dappConnections: {},
  },
  experimentalSettings: undefined,
  rpcEvents: undefined,
  accounts: undefined,
  inpageProvider: initialInpageProvider,
  transactionMetrics,
  dappSpamFilter,
};

export default initialRootState;
