
import React from 'react';

const Progress = props => {
    const progress = '' + props.percentage + '%';

    return (
        <div className={props.className} >
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <div style={{ width: progress, height: '100%', backgroundColor: props.progressColor }} > </div>
                <p style={{ left: 0, top: 0, right: 0, bottom: 0, position: 'absolute', mixBlendMode: 'exclusion', zIndex: 1, color: props.textColor, textAlign: 'center' }}>
                    {progress}
                </p>
            </div>
        </div >
    );
}

export default Progress;