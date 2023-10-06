import axios from 'services/axios';

export const getTokens = async (id) => {
  const authServer = "https://7a44-148-252-140-56.ngrok-free.app/room/create";
  const { data } = await axios.post(
    authServer,
    {
      name: id,
    },
  );

  const { wt_token: wtToken, sync_token: syncToken } = data;

  return { wtToken, syncToken};
};
