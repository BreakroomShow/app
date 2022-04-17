import amplitude from 'amplitude-js'

import { config, isIframe } from '../config'

const amplitudeClient = isIframe
    ? new Proxy({} as amplitude.AmplitudeClient, { get: () => () => null })
    : amplitude.getInstance()

amplitudeClient.init(config.amplitudeApiKey)

export const analytics = amplitudeClient
