export function getTimestampFromMetadata(e) {
    try {
        if (!e.data) {
            return null;
        }

        let data = e.data;

        data = data.substring(data.indexOf('{'), 1 + data.lastIndexOf('}'));
        const json = JSON.parse(data);

        const timestamp = Number(json.ut || json.utc);
        if (isNaN(timestamp)) {
            return null;
        }

        return timestamp;
    } catch (e) {
        return null
    }
}

export function onID3StatusChange(player, clb) {
    let available = false;
    let lastMetadataTimestamp;

    let timeout;

    const setTimer = () => {
        timeout = setTimeout(() => {
            if (player.paused) {
                return;
            }

            if (available) {
                clb(false)
            }

            available = false;
        }, 3000);
    }

    const listener = (e) => {
        if (lastMetadataTimestamp && e.timestamp - lastMetadataTimestamp < 500) {
            return;
        }

        lastMetadataTimestamp = e.timestamp;

        const timestamp = getTimestampFromMetadata(e);

        if (timestamp) {
            clearTimeout(timeout);
            setTimer();
        }

        if (timestamp && !available) {
            available = true;
            clb(true)
        } else if (!timestamp && available) {
            available = false;
            clb(false)
        }
    }

    const off = onID3Metadata(player, listener);

    setTimer();

    return () => {
        off();
        clearTimeout(timeout);
    };
}

export function onID3Metadata(player, clb) {
    // @ts-ignore
    const cleanup = [];

    const getID3TextTrack = () => {
        const tracks = player.textTracks;
        for (let i = 0, L = tracks.length; i < L; i++) {
            if (tracks[i].label === 'id3') {
                return tracks[i];
            }
        }
    }

    // @ts-ignore
    const handleID3Track = (track) => {
        track.addEventListener('cuechange', onCueChange);
        cleanup.push(() => {
            track.removeEventListener('cuechange', onCueChange);
        })
    }

    // @ts-ignore
    const onCueChange = (e) => {
        try {
            const cue = e.target.activeCues[0];
            if (cue) {
                const position = (cue.endTime + cue.startTime) / 2;

                clb({
                    timestamp: Date.now(),
                    position,
                    data: cue.value.data
                })
            }
        } catch(e) {
            console.warn(e)
        }
    }

    const ID3Track = getID3TextTrack();

    if (ID3Track) {
        handleID3Track(ID3Track);
    } else {
        // @ts-ignore
        const onaddtrack = (e) => {
            if (e?.track?.label === 'id3') {
                handleID3Track(e.track);
            }
        }

        player.textTracks.addEventListener('addtrack', onaddtrack);

        cleanup.push(() => {
            player.textTracks.removeEventListener('addtrack', onaddtrack);
        })
    }

    return () => {
        // @ts-ignore
        cleanup.forEach(func => func())
    }
}

