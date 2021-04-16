import React, {createElement, createContext, useState, useContext, useCallback}
    from 'react'
import {Popup} from 'lib/ui'
import s from './style.css'


const ModalContext = createContext()


export const ModalProvider = ({children}) => {
    const
        [title, setTitle] = useState(),
        [component, setComponent] = useState(),
        [params, setParams] = useState({}),

        open = useCallback((...args) => {
            let title, component, params

            if (typeof args[0] === 'string') {
                [title, component, params] = args
            } else {
                [component, params] = args
            }

            setTitle(title)
            setComponent(() => component)
            setParams(params)
        }),

        close = useCallback(() => setComponent(null))

    return <ModalContext.Provider
        value={{open, close, component, params}}
    >
        {component &&
            <div
                className={s.overlay}
                onClick={close}
                children={
                    <Popup
                        title={title}
                        onClose={close}
                        className={s.popup}
                        onClick={e => e.stopPropagation()}
                        children={createElement(component, params)}
                    />}
            />}

        {children}
    </ModalContext.Provider>
}


export const useModal = () => useContext(ModalContext)
