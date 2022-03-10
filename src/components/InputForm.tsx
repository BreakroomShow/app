import { ComponentProps, ReactNode, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { Box, css, styled } from '../design-system'
import { useForceUpdate } from '../hooks/useForceUpdate'
import { ReactComponent as ArrowIcon } from '../images/arrow.svg'

const Form = styled('form', {})

const containerCss = css({
    all: 'unset',
    outline: 'revert',

    position: 'relative',
    overflow: 'hidden',

    display: 'flex',
    alignItems: 'center',
    minHeight: 84,
    borderRadius: 84 / 2,
    border: '1.5px solid rgba(0, 0, 0, 0.1)',

    paddingLeft: 36,
})

const arrowCss = css({
    all: 'unset',
    outline: 'revert',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: '$pill',

    background: '$brightGreen',
    color: '$black',

    transition: 'transform .4s',

    size: 60,

    variants: {
        flexible: {
            true: {
                width: 'auto',
                paddingX: 32,
                maxWidth: '50%',
                textAlign: 'center',
            },
        },
    },
})

const Label = styled('label', containerCss, {
    paddingRight: 60 + 12 * 2,
})

const TextareaContainer = styled(Box, {
    maxHeight: 120,
    width: '100%',
    overflowY: 'auto',
})

const Textarea = styled(TextareaAutosize, {
    all: 'unset',

    width: '100%',
    wordBreak: 'break-word',
    overflow: 'hidden',

    color: '$black',
    fontSize: '$sm',
    lineHeight: '$xs',
})

const InputSubmitButton = styled('button', arrowCss, {
    position: 'absolute',
    right: 10,
    top: 10,

    '&:active': {
        transform: 'translateX(2px)',
    },
})

interface InputFormProps {
    placeholder: string
    onSubmit(message: string, reset: () => void): void
}

export function InputForm({ placeholder, onSubmit }: InputFormProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const forceUpdate = useForceUpdate()

    const submit = (reset: () => void) => {
        if (!inputRef.current) return

        const text = inputRef.current.value.trim()

        if (!text) return

        onSubmit(text, () => {
            reset()
            forceUpdate()
        })
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
                <TextareaContainer>
                    <Textarea ref={inputRef} placeholder={placeholder} />
                </TextareaContainer>
                <InputSubmitButton>
                    <ArrowIcon />
                </InputSubmitButton>
            </Label>
        </Form>
    )
}

const Icon = styled('div', arrowCss, {
    overflowWrap: 'normal',
    flexShrink: 0,
})

const Button = styled('button', containerCss, {
    fontFamily: '$body',
    color: '$black',
    fontSize: '$md',
    fontWeight: '$medium',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    paddingRight: 12,
    overflowWrap: 'anywhere',

    '&:active': {
        [`& ${Icon}`]: {
            transform: 'translateX(2px)',
        },
    },
})

const ButtonContent = styled(Box, {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
})

type InputLikeButtonProps = ComponentProps<typeof Button> & {
    arrow?: ReactNode
}

export function InputLikeButton({ children, arrow, ...props }: InputLikeButtonProps) {
    return (
        <Button {...props}>
            <ButtonContent>{children}</ButtonContent>
            <Icon flexible={!!arrow}>{arrow || <ArrowIcon />}</Icon>
        </Button>
    )
}
