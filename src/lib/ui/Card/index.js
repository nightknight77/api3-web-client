import React from 'react'
import Button from '../Button'
import s from './style.css'


const Card = ({
    title,
    children,
    cta1: {title: cta1Title, action: cta1Action} = {},
    cta2: {title: cta2Title, action: cta2Action} = {},
    className = '',
    ...props
}) =>
    <div
        className={s.card + ' ' + className}
        {...props}
    >
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
                    className={s.button}
                />}
        </footer>
    </div>


export default Card
