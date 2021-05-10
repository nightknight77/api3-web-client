import React from 'react'

const {round, PI, cos, sin} = Math


const RadialChart = ({completionPercent}) => {
    const
        r = 50,
        strokeWidth = 6,
        side = r * 2 + strokeWidth * 2,
        center = r + strokeWidth

    return <svg width={side} height={side}>
        <circle
            cx={center}
            cy={center}
            r={r}
            stroke='#404141'
            strokeWidth={3}
        />

        <path
            stroke='url(#gradient)'
            strokeWidth={strokeWidth}
            strokeLinecap='round'
            d={describeArc(
                center,
                center,
                r,
                0,
                round(completionPercent / 100 * 360),
            )}
        />

        <text
            x='50%'
            y='45%'
            textAnchor='middle'
            dominantBaseline='middle'
            fill='white'
            fontSize={24}
            children={completionPercent + '%'}
        />

        <text
            x='50%'
            y='62%'
            textAnchor='middle'
            dominantBaseline='middle'
            fill='white'
            children='OF TARGET MET'
            fontSize={8}
        />

        <defs>
            <linearGradient
                id='gradient'
                x1='0%'
                x2='100%'
                y1='0%'
                y2='0%'
            >
                 <stop offset='0%' stop-color='#7ce3cb' />
                 <stop offset='100%' stop-color='#7963b2' />
            </linearGradient>
        </defs>
    </svg>
}

export default RadialChart


/* Following functions copied from:
 * https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle */// eslint-disable-line max-len

const describeArc = (x, y, radius, startAngle, endAngle) => {
    const
        start = polarToCartesian(x, y, radius, endAngle),
        end = polarToCartesian(x, y, radius, startAngle),
        largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

    return [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    ]
        .join(' ')
}


const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * PI / 180.0

    return {
        x: centerX + (radius * cos(angleInRadians)),
        y: centerY + (radius * sin(angleInRadians)),
    }
}
