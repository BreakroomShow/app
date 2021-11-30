import { useCreateGame } from '../api/mutations'
import { GameForm } from './GameForm'

export function CreateGameForm({ gameId }: { gameId: number }) {
    const createGameMutation = useCreateGame(gameId)

    return <GameForm onSuccess={(data, reset) => createGameMutation.mutate(data, { onSuccess: reset })} />
}
