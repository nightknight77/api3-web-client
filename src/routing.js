import {createRouter} from 'router5'
import browserPlugin from 'router5-plugin-browser'
import loggerPlugin from 'router5-plugin-logger'
import {keyBy} from 'lodash-es'
import {Dashboard, ProposalListing} from './scenes'


const routes = [
    {name: 'staking',   path: '/',          component: Dashboard},
    {name: 'proposals', path: '/proposals', component: ProposalListing},
]

export const routesByName = keyBy(routes, 'name')

export const router = createRouter(routes)

router.usePlugin(browserPlugin({}), loggerPlugin)
