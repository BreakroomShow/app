import { useReplay } from '../../../pages/Landing/useReplay'
import matcap from '../assets/matcap_texture_white.png'
import { MultilineTextPro } from '../components/MultilineText'

export const GameInfoSplash = () => {
    const { event } = useReplay()
    // const playersCount = event?.type === 'game_info_splash' && event.players
    const prizefund = event?.type === 'game_info_splash' && event.prize_fund_usd
    return (
        <MultilineTextPro
            texts={[
                // { text: 'players today', size: 0.32 },
                // { text: String(playersCount || 100), size: 1 },
                { text: 'Prize Fund', size: 0.32 },
                { text: `$${String(prizefund || 100)}`, size: 1 },
            ]}
            textProps={{ matcap }}
        />
    )
}
