import { SyncSDK, Callbacks, LogLevels } from '@sscale/syncsdk';
import axios from 'services/axios';

const syncInstance = new SyncSDK();
syncInstance.setLogLevel(LogLevels.DEBUG);

export const attachDeltaListener = (clb) => {
  syncInstance?.attachListener(clb, Callbacks.delta_change);
};

export const attachPlaybackRateListener = (clb) => {
  syncInstance?.attachListener(clb, Callbacks.speed_change);
};

export const setGroup = async (token, clientName) => {
  if (token && clientName) await syncInstance.createGroup(token, clientName);
};

export const setClientToSdk = (client) => {
  syncInstance.addPlayerClient(client);
};

export const stopSync = () => {
  syncInstance.stopSynchronize();
};

export const startSynchronize = async () => {
  await syncInstance.startSynchronize();
};

export const groupSeek = () => {
  syncInstance.setGroupPosition();
};
