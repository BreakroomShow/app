import { selectRandom } from '../../../utils/selectRandom'
import { colors } from './constants'

export const getRandomColor = () => selectRandom(colors.trivia)
