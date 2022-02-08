import { ComponentMeta, ComponentStory } from '@storybook/react'

import { VFX } from '../containers/VFX'

export default {
    title: 'App/VFX',
    component: VFX,
} as ComponentMeta<typeof VFX>

const Template: ComponentStory<typeof VFX> = (args) => <VFX {...args} />

export const Default = Template.bind({})
Default.args = {
    speed: 2.4,
    isPlaying: true,
}
