import React from 'react'
import {Carousel} from 'react-responsive-carousel'
import {noop} from 'lodash-es'
import prevArrowImg from './prev.svg'
import nextArrowImg from './next.svg'
import stepBgImg from './step-bg.svg'
import s from './style.css'


const Slider = ({slides, className, ...props}) =>
    <div className={className}>
        <Carousel
            showStatus={false}
            showThumbs={false}
            renderArrowPrev={(...args) => renderArrow('prev', ...args)}
            renderArrowNext={(...args) => renderArrow('next', ...args)}
            renderIndicator={renderIndicator}
            children={slides.map((slideContent, idx) =>
                <div key={idx} className={s.item}>
                    <StepNoIndicator no={idx + 1} />
                    <p children={slideContent} />
                </div>,
            )}
            {...props}
        />
    </div>

export default Slider


const renderArrow = (direction, onClick, clickable) =>
    <img
        className={
            s.arrowImg + ' '
            + s[direction] + ' '
            + (clickable ? s.clickable : '')
        }
        src={direction === 'prev' ? prevArrowImg : nextArrowImg}
        onClick={clickable ? onClick : noop}
    />


const renderIndicator = (onClick, active) =>
    <span
        className={s.indicator + ' ' + (active ? s.active : '')}
        onClick={onClick}
    />


const StepNoIndicator = ({no}) =>
    <span className={s.stepNo}>
        <img src={stepBgImg} />
        <h1 children={no} />
    </span>
