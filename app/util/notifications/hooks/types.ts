import type { InternalAccount } from '@metamask/keyring-api';
import { KeyringTypes } from '@metamask/keyring-controller';
import type { Notification } from '../../../util/notifications/types/notification';

export interface UseCreateSessionReturn {
  createSession: () => void;
  error: string | undefined;
}
export interface EnableMetametricsReturn {
  enableMetametrics: () => void;
  loading: boolean;
  error: string | undefined;
}
export interface DisableMetametricsReturn {
  disableMetametrics: () => void;
  loading: boolean;
  error: string | undefined;
}
export interface ListNotificationsReturn {
  listNotifications: () => Notification[] | undefined;
  notificationsData?: Notification[];
  isLoading: boolean;
  error: string | undefined;
}
export interface CreateNotificationsReturn {
  createNotifications: (accounts: string[]) => void;
  loading: boolean;
  error: string | undefined;
}
export interface EnableNotificationsReturn {
  enableNotifications: () => void;
  loading: boolean;
  error: string | undefined;
}
export type AccountType = InternalAccount & {
  balance: string;
  keyring: KeyringTypes;
  label: string;
};

export interface DisableNotificationsReturn {
  disableNotifications: () => void;
  loading: boolean;
  error: string | undefined;
}

export interface MarkNotificationAsReadReturn {
  markNotificationAsRead: (notifications: Notification[]) => void;
  error: string | undefined;
}

export interface EnableProfileSyncingReturn {
  enableProfileSyncing: () => void;
  error: string | undefined;
}

export interface DisableProfileSyncingReturn {
  disableProfileSyncing: () => void;
  error: string | undefined;
}

export interface SetIsProfileSyncingEnabledReturn {
  setIsProfileSyncingEnabled: () => void;
  error: string | undefined;
}

export interface SwitchSnapNotificationsChangeReturn {
  onChange: (state: boolean) => void;
  error: string | undefined;
}
export interface SwitchFeatureAnnouncementsChangeReturn {
  onChange: (state: boolean) => void;
  error: string | undefined;
}

export interface SwitchPushNotificationsReturn {
  onChange: (UUIDS: string[], state: boolean) => void;
  error: string | undefined;
}

export interface UseSwitchAccountNotificationsData {
  [address: string]: boolean;
}

export interface SwitchAccountNotificationsReturn {
  switchAccountNotifications: () => Promise<
    UseSwitchAccountNotificationsData | undefined
  >;
  isLoading: boolean;
  error: string | undefined;
}

export interface SwitchAccountNotificationsChangeReturn {
  onChange: (addresses: string[], state: boolean) => void;
  error: string | undefined;
}
