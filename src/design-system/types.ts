import type { CSS } from '@stitches/react'

import type { config, cssFactory } from './config'
import type { medias } from './medias'
import type { alignTokens, alignYTokens } from './tokens'

export type Css = CSS<typeof cssFactory>

export type Color = keyof typeof config.theme.colors
export type Font = keyof typeof config.theme.fonts
export type FontSize = keyof typeof config.theme.fontSizes
export type LineHeight = keyof typeof config.theme.lineHeights
export type FontWeight = keyof typeof config.theme.fontWeights
export type Radius = keyof typeof config.theme.radii
export type Space = keyof typeof config.theme.space
export type MediaToken = keyof typeof medias
export type Media = `@${MediaToken}`

export type Align = typeof alignTokens[number]
export type AlignY = typeof alignYTokens[number]

export type MediaMap<T> = { [media in Media]?: T }
export type MediaProp<T> = T | MediaMap<T>
