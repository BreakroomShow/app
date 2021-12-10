import { createClient } from '@supabase/supabase-js'

import { UnrevealedQuestion } from '../src/types'

if (typeof process.env.SUPABASE_URL === 'undefined' || typeof process.env.SUPABASE_KEY === 'undefined') {
    throw new Error('Provide SUPABASE_URL and SUPABASE_KEY')
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export function selectUnrevealedQuestions(questionKeys: string[]) {
    return supabase
        .from<UnrevealedQuestion>('questions')
        .select('*')
        .in('publicKey', questionKeys)
        .then((res) => res.data || [])
}

export function insertUnrevealedQuestion(question: UnrevealedQuestion) {
    return supabase.from<UnrevealedQuestion>('questions').insert(question).single()
}

export function deleteUnrevealedQuestion(questionKey: string) {
    return supabase.from<UnrevealedQuestion>('questions').delete().eq('publicKey', questionKey)
}

interface GameStatusTable {
    id: 'next_game_id'
    game_id: null | number
}

export function selectCurrentGameId() {
    return supabase
        .from<GameStatusTable>('game_status')
        .select('game_id')
        .eq('id', 'next_game_id')
        .single()
        .then((res) => res.data?.game_id || null)
}

export function updateCurrentGameId(gameId: null | number) {
    return supabase.from<GameStatusTable>('game_status').update({ id: 'next_game_id', game_id: gameId }).single()
}
