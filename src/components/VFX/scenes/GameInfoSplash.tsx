import { GameEvent } from '../../../types'
import matcap from '../assets/matcap_texture_white.png'
import { MultilineTextPro } from '../components/MultilineText'

export const GameInfoSplash = ({ event }: { event: GameEvent }) => {
    if (!event || event.type !== 'game_info_splash') return null

    return (
        <MultilineTextPro
            texts={[
                { text: 'players today', size: 0.32 },
                { text: event.players.toLocaleString('en'), size: 1 },
            ]}
            textProps={{ matcap }}
        />
    )
}
