import {createRouter} from 'router5'
import browserPlugin from 'router5-plugin-browser'
import loggerPlugin from 'router5-plugin-logger'
import {keyBy} from 'lodash-es'
import {Landing} from './scenes'


const routes = [
    {name: 'landing', path: '/', component: Landing},
]

export const routesByName = keyBy(routes, 'name')

export const router = createRouter(routes)

router.usePlugin(browserPlugin({}), loggerPlugin)
