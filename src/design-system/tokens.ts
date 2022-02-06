import { config } from './config'
import { medias } from './medias'
import type { Color, Font, FontSize, FontWeight, LineHeight, MediaToken, Radius, Space } from './types'

export const spaceTokens = Object.keys(config.theme.space) as Space[]
export const radiiTokens = Object.keys(config.theme.radii) as Radius[]
export const colorTokens = Object.keys(config.theme.colors) as Color[]
export const fontTokens = Object.keys(config.theme.fonts) as Font[]
export const fontSizeTokens = Object.keys(config.theme.fontSizes) as FontSize[]
export const weightTokens = Object.keys(config.theme.fontWeights) as FontWeight[]
export const lineHeightTokens = Object.keys(config.theme.lineHeights) as LineHeight[]
export const mediaTokens = Object.keys(medias) as MediaToken[]
export const alignTokens = ['left', 'center', 'right'] as const
export const alignYTokens = ['top', 'center', 'bottom', 'baseline'] as const
