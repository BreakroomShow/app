import { useCreateGame } from '../../api/mutations'
import { GameForm } from './GameForm'

interface CreateGameFormProps {
    gameId: number
    onSuccess(): void
}

export function CreateGameForm({ gameId, onSuccess }: CreateGameFormProps) {
    const createGameMutation = useCreateGame(gameId)

    return (
        <GameForm
            onSuccess={(data, reset) => {
                createGameMutation.mutate(data, {
                    onSuccess() {
                        reset()
                        onSuccess()
                    },
                })
            }}
        />
    )
}
