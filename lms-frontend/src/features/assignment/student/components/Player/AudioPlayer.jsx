import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';

export default function AudioPlayer({ src, maxPlays=2, onPlayedChange }) {
    const audioRef = useRef(null);
    const [plays, setPlays] = useState(0);
    const [rate, setRate] = useState(1);

    const handlePlay = () => {
        if (plays >= maxPlays) return;
        audioRef.current.playbackRate = rate;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        const next = plays + 1;
        setPlays(next);
        onPlayedChange?.(next);
    };

    return (
        <div className="as-audio">
            <audio ref={audioRef} src={src} preload="auto" />
            <Button icon="pi pi-play" className="p-button-rounded" onClick={handlePlay} disabled={plays>=maxPlays} />
            <div className="as-audio__bar">
                <div className="as-audio__progress" style={{ width: `${(plays/maxPlays)*100}%` }} />
            </div>
            <div className="as-audio__controls">
                <Button label={`${rate}x`} className="p-button-text" onClick={() => setRate((r)=> (r===1?1.25: r===1.25?1.5: r===1.5?2:1))} />
                <span>{plays}/{maxPlays} plays</span>
            </div>
        </div>
    );
}
