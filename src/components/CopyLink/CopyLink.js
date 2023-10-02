import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import './CopyLink.css';

const CopyLink = () => {
  const { roomId } = useSelector((state) => state.participant);
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = new URL(window.location.href);
    url.searchParams.append('room', roomId);
    navigator.clipboard.writeText(url.toString());

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      className={classNames('copy-link', { 'copy-link__done': copied })}
      onClick={handleClick}
      title={copied ? 'Copied' : 'Copy link'}
    />
  );
};

export default CopyLink;
