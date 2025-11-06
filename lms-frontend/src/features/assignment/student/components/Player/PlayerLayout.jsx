import React from 'react';

export default function PlayerLayout({ sidebar, main, footer }){
    return (
        <div className="as-player">
            {sidebar}
            <div className="as-main">
                {main}
                {footer}
            </div>
        </div>
    );
}