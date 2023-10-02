import React from 'react';

import './VisitedChips.css';

function VisitedChips({ names }) {
    if (!names.length) {
        return null;
    }

    return (
        <div className='visited-chips-root'>
            {names.map(name => (
                <div className='visited-chips' title={`Visited By ${name}`}>
                    {name}
                </div>
            ))}
        </div>
    );
}

export default VisitedChips;
