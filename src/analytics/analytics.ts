import amplitude from 'amplitude-js'

import { config } from '../config'
import { isIframe } from '../utils/isIframe'

const amplitudeClient = isIframe
    ? new Proxy({} as amplitude.AmplitudeClient, { get: () => () => null })
    : amplitude.getInstance()

amplitudeClient.init(config.amplitudeApiKey)

export const analytics = amplitudeClient
