import { OrbitControls } from '@react-three/drei'
import { ComponentMeta, Story } from '@storybook/react'

import { VFX } from '../containers/VFX'
import { ReplayContext } from '../pages/Replay'
import { GameEvent } from '../types'

const types: { [event in GameEvent['type']]?: GameEvent } = {
    crypto_fact: {
        type: 'crypto_fact',
        distribution_type: 'socket',
        duration: 1,
        game_start_offset: 30,
        text: 'use new wallets for untrusted apps',
    },
    intro_splash: {
        type: 'intro_splash',
        distribution_type: 'socket',
        duration: 4.166666666666667,
        game_start_offset: 0,
    },
    game_info_splash: {
        type: 'game_info_splash',
        players: 100,
        prize_fund_usd: 100,
        sponsor_title: 'Dnevnichok',
        distribution_type: 'chain',
        duration: 10.0833333333333,
        game_start_offset: 25,
    },
    question: {
        type: 'question',
        distribution_type: 'chain',
        duration: 4.166666666666667,
        game_start_offset: 10,
        question: 'Cristiano Ronaldo plays which sport?',
        answers: ['Soccer', 'Basketball', 'Baseball'],
        question_public_key: '',
        question_index: 0,
    },
    answer_reveal: {
        type: 'answer_reveal',
        distribution_type: 'chain',
        duration: 2.0833333333333335,
        game_start_offset: 25,
        question: {
            type: 'question',
            distribution_type: 'chain',
            duration: 10,
            game_start_offset: 10,
            question: 'Cristiano Ronaldo plays which sport?',
            answers: ['Soccer', 'Basketball', 'Baseball'],
            question_index: 0,
        },
        correct_answer_ind: 0,
        answer_count: {
            '0': 100,
            '1': 75,
            '2': 50,
        },
    },
    question_fact: {
        type: 'question_fact',
        distribution_type: 'socket',
        duration: 2.0833333333333335,
        game_start_offset: 30,
        text: `Ronaldo has made over $1 billion in career earnings, the first team sport athlete to hit the milestone.`,
        image_url: null,
    },
}

export default {
    title: 'App/VFX',
    component: VFX,
    argTypes: {
        event: { name: 'Event', control: { type: 'select', options: types } },
    },
} as ComponentMeta<typeof VFX>

const Template: Story<{
    speed: number
    isPlaying: boolean
    event: GameEvent
}> = (args) => (
    <ReplayContext.Provider value={args}>
        <VFX {...args}>
            <OrbitControls />
        </VFX>
    </ReplayContext.Provider>
)

export const Default = Template.bind({})

Default.args = {
    speed: 2.4,
    isPlaying: true,
    event: types.intro_splash,
}
