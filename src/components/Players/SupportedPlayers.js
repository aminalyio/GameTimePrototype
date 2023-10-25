import DailymotionPlayer from "./DailymotionPlayer";
import HtmlPlayer from "./HtmlPlayer";
import YoutubePlayer from "./YoutubePlayer";

export const DEFAULT_PLAYER = 'Youtube';

export const PLAYERS = {
    'Youtube': YoutubePlayer,
    'Dailymotion': DailymotionPlayer,
    'SQUASH TV': DailymotionPlayer,
    'Seenic HTML': HtmlPlayer,
 };

 export const DAILYMOTION_PLAYER = {
    'Dailymotion': 'xk9h6',
    'SQUASH TV': 'xfv23',
 };

