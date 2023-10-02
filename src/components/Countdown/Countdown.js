import { useEffect, useRef } from 'react';

function Countdown({ value }) {
  const id = useRef(`${Date.now()}${Math.floor(Math.random() * 10000)}`).current;
  const initialValue = useRef(value).current;
  const date = useRef(Date.now()).current;

  useEffect(() => {
    let timer;
    const $el = document.getElementById(id);

    function calc() {
      const time = Math.max(0, initialValue * 1000 - (Date.now() - date));

      let seconds = Math.floor((time / 1000) % 60),
        minutes = Math.floor((time / (1000 * 60)) % 60);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      $el.innerHTML = minutes + ':' + seconds;

      if (time <= 0) {
        return;
      }

      timer = setTimeout(calc, 1000);
    }

    calc();

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <span id={id} />;
}

export default Countdown;
