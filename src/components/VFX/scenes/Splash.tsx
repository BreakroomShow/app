import { MultilineText } from '../components/MultilineText'
import { Sparks } from '../components/Sparks'
import { colors } from '../helpers/constants'

export const Splash = () => (
    <>
        <MultilineText />
        <Sparks count={15} colors={colors.sparks} />
    </>
)
