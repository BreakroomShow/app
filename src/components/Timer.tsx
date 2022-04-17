import { useState } from 'react'

import { Box, Color, Typography, styled } from '../design-system'
import { useNonce } from '../hooks/useNonce'
import { Progress } from './Progress'

const TimeContainer = styled(Box, {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
})

export function Timer({ deadline, active = true, speed = 1 }: { deadline: number; active?: boolean; speed?: number }) {
    const { nonce, stop } = useNonce({ delay: 333, active })

    const [startTime] = useState(() => Date.now())
    const remainTime = Math.max(deadline - nonce, 0)
    const totalTime = deadline - startTime
    const timeOffset = 800 / speed
    const pastTime = totalTime - remainTime + timeOffset
    const progress = 1 - pastTime / totalTime

    let color: Color = 'brightGreen'

    if (progress < 0.75) {
        color = 'yellow'
    }

    if (progress < 0.3 || remainTime <= (4 * 1000) / speed) {
        color = 'orange'
    }

    if (remainTime <= 0) {
        stop()
    }

    return (
        <Box css={{ position: 'relative' }}>
            <Progress value={progress} color={color} background="darkGrey" size={84} width={5} />
            <TimeContainer>
                <Typography as="h2" color="white" lineHeight="base">
                    {Math.floor(remainTime / (1000 / speed))}
                </Typography>
            </TimeContainer>
        </Box>
    )
}
