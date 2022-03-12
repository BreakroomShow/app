import { Diamonds } from '../components/Diamonds'
import { FlatText } from '../components/FlatText'

export const Tips = () => {
    return (
        <>
            <FlatText text="don’t enter your seed phrase anywhere, but trusted wallets" widthCoeff={0.33} />
            <Diamonds />
        </>
    )
}
