import React from 'react'
import Button from '../Button'
import downArrowImg from './down-arrow.svg'
import s from './style.css'


const Card = ({
    title,
    children,
    cta1: {title: cta1Title, action: cta1Action} = {},
    cta2: {title: cta2Title, action: cta2Action} = {},
    extension,
    className = '',
    ...props
}) => <div className={className} {...props}>
    <div className={s.card}>
        <header>
            <h2 children={title} />

            <Button
                children={cta1Title}
                onClick={cta1Action}
                style={{visibility: cta1Title ? 'visible' : 'hidden'}}
            />
        </header>

        {children}

        <footer>
            {cta2Title &&
                <Button
                    children={cta2Title}
                    onClick={cta2Action}
                    variant='link'
                />}
        </footer>
    </div>

    {extension &&
        <div
            className={s.card + ' ' + s.extension}
            {...props}
        >
            <header children={<img src={downArrowImg} />} />
            {extension}
        </div>}
</div>


export default Card
