import { ComponentMeta, ComponentStory } from '@storybook/react'

import { VFX } from '../containers/VFX'

const types: any = {
    game_info_splash: {
        type: 'game_info_splash',
        players: 100,
        prize_fund_usd: 100,
        sponsor_title: 'Dnevnichok',
        distribution_type: 'chain',
        duration: 2.0833333333333335,
        game_start_offset: 25,
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
        },
        correct_answer_ind: 0,
        answer_count: {
            '0': 100,
            '1': 75,
            '2': 50,
        },
    },
    empty: null,
}

export default {
    title: 'App/VFX',
    component: VFX,
    argTypes: {
        event: { name: 'Event', control: { type: 'select', options: types } },
    },
} as ComponentMeta<typeof VFX>

const Template: ComponentStory<typeof VFX> = (args) => <VFX {...args} />

export const Default = Template.bind({})
Default.args = {
    speed: 2.4,
    isPlaying: true,
    event: types.game_info_splash,
}
