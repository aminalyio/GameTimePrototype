import { useEffect, useRef } from 'react';

function Timer({value}) {
    const id = useRef(`${Date.now()}${Math.floor(Math.random() * 10000)}`).current;
    const initialValue = useRef(value).current;
    const date = useRef(Date.now()).current;

    useEffect(() => {
        let timer;
        const $el = document.getElementById(id);

        function calc() {
            const time = initialValue + Date.now() - date;

            let seconds = Math.floor((time / 1000) % 60),
              minutes = Math.floor((time / (1000 * 60)) % 60),
              hours = Math.floor((time / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            $el.innerHTML = hours + ":" + minutes + ":" + seconds;

            timer = setTimeout(calc, 1000);
        }

        calc();

        return () => {
            clearInterval(timer)
        }
    }, [])

    return <span id={id}/>;
}

export default Timer;
