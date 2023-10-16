import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Message';
import useStyles from './Chat.css';
import ChatDialog from './ChatDialog/ChatDialog';
import { off, on } from '../../services/PubSub';


const Chat = () => {
  const s = useStyles();
  const [isChatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);

  function handleMessage(message) {
    // @ts-ignore
    setMessages((current) => [
        ...current,
        { message, date: new Date().toISOString().slice(11, 16).toString() },
    ]);
  }

  useEffect(() => {
    on('chat_update', handleMessage);

    return () => {
        off('chat_update', handleMessage);
    };
  }, []);

  const openChat = () => {
    setChatVisible(!isChatVisible);
  };

  return (
    <div className={s.chatContainer}>
      {isChatVisible && (
        <div className={s.chatDialog}>
          <ChatDialog chatClose={openChat} messages={messages} />
        </div>
      )}

      <Tooltip title={<div className={s.tooltipBox}>Group chat</div>}>
        <IconButton aria-label="Open" className={s.openChatButton} onClick={() => openChat()}>
          <MessageIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </div>

  );
};

export default Chat;