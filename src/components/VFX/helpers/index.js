import { randInt } from 'three/src/math/MathUtils'

import { colors } from './constants'

export const getRandomColor = () => colors.trivia[randInt(0, colors.trivia.length - 1)]
