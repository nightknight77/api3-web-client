const
    React = require('react'),
    ReactDOM = require('react-dom')


const boot = () => {
    ReactDOM.render(<App />, document.getElementById('app'))

    if (process.env.NODE_ENV === 'development')
        module.hot.accept()
}

const App = () => <>hey</>


boot()
