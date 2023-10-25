import axios from 'services/axios';

export const getTokens = async (id, pid, vid) => {
  const authServer = "https://e28c-148-252-133-26.ngrok-free.app/room/create";
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
