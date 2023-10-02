import axios from 'services/axios';

export const getTokens = async (id) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_TOKEN_SHARING_SERVICE_URL}/room/create`,
    {
      name: id,
    },
  );

  const { wt_token: wtToken, sync_token: syncToken } = data;

  return { wtToken, syncToken};
};
