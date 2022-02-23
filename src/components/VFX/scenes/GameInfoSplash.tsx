import { useReplay } from '../../../pages/Landing/useReplay'
import matcap from '../assets/matcap_texture_white.png'
import { MultilineTextPro } from '../components/MultilineText'

export const GameInfoSplash = () => {
    const { event } = useReplay()
    const playersCount = event?.type === 'game_info_splash' && event.players
    return (
        <MultilineTextPro
            texts={[
                { text: 'players today', size: 0.32 },
                { text: String(playersCount || 100), size: 1 },
            ]}
            textProps={{ matcap }}
        />
    )
}
