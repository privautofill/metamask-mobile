import { ImageSourcePropType } from 'react-native';
import { TabBarProps } from 'react-native-scrollable-tab-view';

export interface Network {
  chainId: string;
  nickname: string;
  rpcPrefs: {
    blockExplorerUrl: string;
    imageSource?: ImageSourcePropType;
    imageUrl?: string;
  };
  rpcUrl: string;
  ticker: string;
  /**
   * Not supported by Infura
   */
  warning?: boolean;
}

export interface CustomNetworkProps {
  /**
   * is network modal open
   */
  isNetworkModalVisible: boolean;
  /**
   * Close or hide network modal
   */
  closeNetworkModal: () => void;
  /**
   * network to add or switch to
   */
  selectedNetwork?: Network;
  /**
   * show or hide warning modal
   */
  toggleWarningModal?: () => void;
  /**
   * show network modal
   */
  showNetworkModal: (networkConfiguration: Network) => void;
  /**
   * Switch tab between popular and custom networks
   */
  // TODO - The name for this type is not accurate. It should be a ref of the ScrollableTabView's tab.
  switchTab?: TabBarProps;
  /**
   * should navigation return to wallet after network change
   */
  shouldNetworkSwitchPopToWallet: boolean;
  /**
   * Callback after network change, overrides shouldNetworkSwitchPopToWallet
   */
  onNetworkSwitch?: () => void;
  /**
   * Show added networks
   */
  showAddedNetworks?: boolean;
  /**
   * List of custom networks
   */
  customNetworksList?: Network[];
  /**
   * If this list of networks is used in a filtered way for example when the user is using a search box to filter networks,
   * we should take that into consideration before displaying an empty state telling the user he has already added all networks.
   * This is the main use case for this prop.
   */
  showCompletionMessage?: boolean;
}
