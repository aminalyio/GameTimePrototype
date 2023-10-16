import axios from 'services/axios';

export const getTokens = async (id) => {
  const authServer = "https://fa5e-148-252-140-234.ngrok-free.app/room/create";
  const { data } = await axios.post(
    authServer,
    {
      name: id,
    },
  );

  const { wt_token: wtToken, sync_token: syncToken } = data;

  return { wtToken, syncToken};
};
