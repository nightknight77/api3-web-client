const
    {createElement, createContext,
        useState, useContext, useCallback} = require('react'),

    {Popup} = require('lib/ui'),

    s = require('./style.css').default


const ModalContext = createContext()


const ModalProvider = ({children}) => {
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


const useModal = () => useContext(ModalContext)


module.exports = {
    ModalProvider,
    useModal,
}
