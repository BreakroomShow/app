import { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { Box, styled } from '../../design-system'
import { useForceUpdate } from '../../hooks/useForceUpdate'
import { ReactComponent as ArrowIcon } from '../../images/arrow.svg'

const Form = styled('form', {
    paddingX: 28,
    paddingBottom: 24,
})

const Label = styled('label', {
    position: 'relative',
    overflow: 'hidden',

    display: 'flex',
    alignItems: 'center',
    minHeight: 84,
    borderRadius: 84 / 2,
    border: '1.5px solid rgba(0, 0, 0, 0.1)',

    paddingLeft: 36,
    paddingRight: 60 + 12 * 2,
})

const Input = styled(TextareaAutosize, {
    all: 'unset',

    width: '100%',
    wordBreak: 'break-word',
    overflow: 'hidden',

    color: '$black',
    fontSize: '$sm',
    lineHeight: '$xs',
})

const SubmitButton = styled('button', {
    all: 'unset',
    outline: 'revert',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '$round',
    position: 'absolute',
    right: 10,
    top: 10,
    size: 60,

    background: '$brightGreen',
    color: '$black',

    transition: 'transform .4s',
    '&:active': {
        transform: 'translateX(2px)',
    },
})

export function ChatInput() {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const forceUpdate = useForceUpdate()

    const submit = (reset: () => void) => {
        if (!inputRef.current) return

        const message = inputRef.current.value.trim()

        if (!message) return
        // TODO sent message

        reset()
        forceUpdate()
    }

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault()
                submit(() => e.currentTarget.reset())
            }}
            onKeyPress={(e) => {
                if (e.key === 'Enter' && !(e.metaKey || e.shiftKey || e.ctrlKey || e.altKey)) {
                    e.preventDefault()
                    submit(() => e.currentTarget.reset())
                }
            }}
        >
            <Label>
                <Box css={{ maxHeight: 120, width: '100%', overflowY: 'auto' }}>
                    <Input ref={inputRef} placeholder="Message..." />
                </Box>
                <SubmitButton>
                    <ArrowIcon />
                </SubmitButton>
            </Label>
        </Form>
    )
}
