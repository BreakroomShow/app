import { CryptoFactEvent } from '../../../types'
import { Diamonds } from '../components/Diamonds'
import { FlatText } from '../components/FlatText'

export const Tips = ({ event }: { event: CryptoFactEvent }) => {
    return (
        <>
            <FlatText text={event.text} widthCoeff={0.33} />
            <Diamonds />
        </>
    )
}
