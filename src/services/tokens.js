import axios from 'services/axios';

export const getTokens = async (id, pid, vid) => {
  const authServer = "http://gametime-auth.eu-north-1.elasticbeanstalk.com/room/create";
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
