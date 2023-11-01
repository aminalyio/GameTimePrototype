import axios from 'services/axios';

export const getTokens = async (id, pid, vid) => {
  console.log(process.env.REACT_APP_TOKEN_SHARING_SERVICE_URL);
  const authServer = `${process.env.REACT_APP_TOKEN_SHARING_SERVICE_URL}/room/create`;
  const { data } = await axios.post(
    authServer,
    {
      name: id,
      playerId: pid, 
      videoId: vid,
    },
  );

  const { wtToken, syncToken, playerId, videoId } = data;

  return { wtToken, syncToken, playerId, videoId};
};
