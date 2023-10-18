import axios from 'services/axios';

export const getTokens = async (id) => {
  const authServer = "https://017e-148-252-140-100.ngrok-free.app/room/create";
  const { data } = await axios.post(
    authServer,
    {
      name: id,
    },
  );

  const { wt_token: wtToken, sync_token: syncToken } = data;

  return { wtToken, syncToken};
};
