import React, {useRef} from 'react'
import s from './style.css'


const numberInputWidthPerChar = {
    sm: 7.5,
    md: 9,
    lg: 14,
}

const Input = ({type, size = 'md', className, style, ...props}) => {
    const inputRef = useRef()

    return <input
        className={
            s.input + ' '
            + className + ' '
            + s['size-' + size] + ' '
            + s['type-' + type]
        }

        ref={el => inputRef.current = el}

        style={{
            ...style,

            ...(type === 'number' && inputRef.current && {
                width:
                    numberInputWidthPerChar[size]
                        * (inputRef.current.value.length || 2),
            }),
        }}

        {...props}
    />
}


export default Input
