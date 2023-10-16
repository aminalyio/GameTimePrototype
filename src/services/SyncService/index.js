import { SyncSDK, Callbacks, LogLevels } from '@sscale/syncsdk';
import { publish } from 'services/PubSub';
import axios from 'services/axios';

const syncInstance = new SyncSDK();
syncInstance.setLogLevel(LogLevels.DEBUG);
syncInstance.attachListener(publish.bind(null, 'chat_update'), Callbacks.chat_update);

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

export const sendMessageToChat = (message) => {
  return syncInstance?.sendMessageToGroup(message);
};

export const groupSeek = () => {
  syncInstance.setGroupPosition();
};
