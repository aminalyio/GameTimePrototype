import React, { useState } from 'react';
import './ChatDialog.css';
import useStyles from './ChatDialog.css.js';
import { sendMessageToChat } from 'services/SyncService';

const ChatDialog = ({ chatClose, messages }) => {
  const s = useStyles();
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    sendMessageToChat(message);
    setMessage('');
  };

  const handleUpKey = (e) => {
    if (e.keyCode === 13 && e.ctrlKey) {
        setMessage(message + '\n');
      } else if (e.keyCode === 13) {
        sendMessage();
    }
    return false;
  };


  return (
    <div className="chat-container">
      <div className="chat-header">
        <div></div>
        <div className="chat-header-room-name">Clients Chat</div>
        <div onClick={() => chatClose()} className="chat-header--close-button">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAMAAACxiD++AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAtUExURUxpcf///////////////////////////////////////////////////////3EAnbYAAAAOdFJOUwADZ66SoQjEhnS7/gsNGQL7+wAAAKtJREFUKM+F01sOhCAQRNESFV/I/pc70Og0YJfyJbmHhBAbGGYHstw8IPV4EOGOmERYIhGpxyUAJxHSz/xlC+1FxE64qB1yj1ZID7oXsel+63ovnj2JXUXue+hvrcLugL+EdG+9XBG8X+Kl34J3YM1g/egvIvdx5EK691RIz78YEXdnQrst6m6JqemXmNo+D/WJNAyVePZWWL0WdlfB+l+UAQQReaAc65DB/wGsZgzLN0IQWAAAAABJRU5ErkJggg=="
            alt=""
          />
        </div>
      </div>

      <div className="message-list">
                {messages.map((item) => {
                    return (
                        <div className={item.message.ownMessage ? s.message : s.blueMessage} key={item.message.message}>
                            <div className={s.messageText}>
                                <div className={s.chatName}>
                                    {!item.message.ownMessage ? item.message.clientName : ''} {item.date}{' '}
                                </div> {' '} : {item.message.message}
                            </div>
                        </div>
                    );
                })}
            </div>
      <div className="user-input">
                <textarea
                    onKeyUp={handleUpKey}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a reply..."
                    cols={30}
                    className="user-input--text"
                />
                <div className="user-input--buttons">
                    {message.length ? (
                        <div className="user-input--button">
                            <button onClick={() => sendMessage()} className="user-input--send-icon-wrapper">
                                <svg
                                    version="1.1"
                                    className="user-input--send-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    width="37.393px"
                                    height="37.393px"
                                    viewBox="0 0 37.393 37.393"
                                    enableBackground="new 0 0 37.393 37.393"
                                >
                                    <g id="Layer_2">
                                        <path d="M36.511,17.594L2.371,2.932c-0.374-0.161-0.81-0.079-1.1,0.21C0.982,3.43,0.896,3.865,1.055,4.241l5.613,13.263 L2.082,32.295c-0.115,0.372-0.004,0.777,0.285,1.038c0.188,0.169,0.427,0.258,0.67,0.258c0.132,0,0.266-0.026,0.392-0.08 l33.079-14.078c0.368-0.157,0.607-0.519,0.608-0.919S36.879,17.752,36.511,17.594z M4.632,30.825L8.469,18.45h8.061 c0.552,0,1-0.448,1-1s-0.448-1-1-1H8.395L3.866,5.751l29.706,12.757L4.632,30.825z"></path>
                                    </g>
                                </svg>
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
    </div>
  );
};

export default ChatDialog;