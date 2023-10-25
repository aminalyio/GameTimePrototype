import axios from 'services/axios';

export const getTokens = async (id) => {
  const authServer = "https://6c44-213-86-221-106.ngrok-free.app/room/create";
  const { data } = await axios.post(
    authServer,
    {
      name: id,
    },
  );

  const { wt_token: wtToken, sync_token: syncToken } = data;

  return { wtToken, syncToken};
};
