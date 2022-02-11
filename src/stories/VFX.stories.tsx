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
    question: {
        type: 'question',
        distribution_type: 'chain',
        duration: 4.166666666666667,
        game_start_offset: 10,
        question: 'Cristiano Ronaldo plays which sport?',
        answers: ['Soccer', 'Basketball', 'Baseball'],
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
    question_fact: {
        type: 'question_fact',
        distribution_type: 'socket',
        duration: 2.0833333333333335,
        game_start_offset: 30,
        text: 'Ronaldo has made over $1 billion in career earnings, the first team sport athlete to hit the milestone.',
        image_url: null,
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
