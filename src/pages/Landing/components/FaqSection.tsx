import * as AccordionPrimitive from '@radix-ui/react-accordion'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { ReactNode } from 'react'

import { analytics } from '../../../analytics'
import { faq } from '../../../config/faq'
import { Box, Stack, Text, Typography, keyframes, styled } from '../../../design-system'
import { ReactComponent as MinusIcon } from '../../../images/minus.svg'
import { ReactComponent as PlusIcon } from '../../../images/plus.svg'
import { SectionTitle } from './SectionTitle'

const Tabs = styled(TabsPrimitive.Root, {})
const Tab = styled(TabsPrimitive.TabsTrigger, {
    all: 'unset',
    outline: 'revert',
    borderRadius: '$pill',
    paddingY: 18,
    paddingX: 32,

    '@down-lg': {
        paddingY: 8,
        paddingX: 16,
    },

    '&[data-state="active"]': {
        background: '$white',
    },
    '&:hover:not([data-state="active"])': {
        background: '$whiteA',
    },
})
const TabList = styled(TabsPrimitive.TabsList, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',

    [`${Tab}`]: {
        '& + &': { marginLeft: '$xs' },
    },
})
const TabContent = styled(TabsPrimitive.TabsContent, {
    marginTop: 24,
})

const Accordion = styled(AccordionPrimitive.Root, {
    $$inset: '100px',

    '@down-lg': {
        $$inset: '60px',
    },
})
const AccordionItemContainer = styled(Box, {
    overflow: 'hidden',
    background: '$white',

    borderRadius: 120,
    '@down-lg': {
        borderRadius: 80,
    },

    width: '100%',
    padding: '$$inset',
    display: 'flex',
    flexDirection: 'column',
})
const AccordionContent = styled(AccordionPrimitive.Content, {
    maxWidth: 740,

    '&[data-state="open"]': {
        animation: `${keyframes({
            from: { height: 0, opacity: 0 },
            to: { opacity: 1, height: 'var(--radix-accordion-content-height)' },
        })} 200ms cubic-bezier(0.87, 0, 0.13, 1)`,
    },
    '&[data-state="closed"]': {
        animation: `${keyframes({
            from: { opacity: 1, height: 'var(--radix-accordion-content-height)' },
            to: { height: 0, opacity: 0 },
        })} 200ms cubic-bezier(0.87, 0, 0.13, 1)`,
    },
})
const AccordionButton = styled('div', {
    all: 'unset',
    marginLeft: '$md',

    size: 56,
    borderRadius: '$round',
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',

    '& > :last-child': { display: 'block' },
    '& > :first-child': { display: 'none' },

    background: '$brightGreen',
    transition: 'background 300ms',

    '[data-state=open] &': {
        background: '$lightGrey',
        '& > :last-child': { display: 'none' },
        '& > :first-child': { display: 'block' },
    },
})

function AccordionItem({ details, summary }: { details: ReactNode; summary: string }) {
    return (
        <AccordionPrimitive.Item value={summary} asChild>
            <AccordionPrimitive.Header asChild>
                <AccordionPrimitive.Trigger asChild>
                    <AccordionItemContainer
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.code === 'Enter' && e.currentTarget.click()}
                        onClickCapture={(e) => {
                            if (window.getSelection()?.toString().trim()) {
                                e.preventDefault()
                            }
                            if ((e.target as HTMLElement).tagName === 'A') {
                                e.stopPropagation()
                            }
                        }}
                    >
                        <Box css={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box css={{ minHeight: 56, display: 'flex', alignItems: 'center' }}>
                                <Text font="heading" size={{ '@initial': 'lg', '@lg': 'xxl' }} weight="bold">
                                    {summary}
                                </Text>
                            </Box>
                            <AccordionButton>
                                <MinusIcon />
                                <PlusIcon />
                            </AccordionButton>
                        </Box>
                        <AccordionContent>
                            <Box css={{ marginTop: 20 }}>
                                <Text color="greyA" preserveLinebreaks>
                                    {details}
                                </Text>
                            </Box>
                        </AccordionContent>
                    </AccordionItemContainer>
                </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
        </AccordionPrimitive.Item>
    )
}

FaqSection.id = 'faq'

const tabs = Object.keys(faq) as Array<keyof typeof faq>

export function FaqSection() {
    return (
        <Stack space="xl">
            <SectionTitle id={FaqSection.id}>F.A.Q.</SectionTitle>
            <Tabs defaultValue={tabs[0]} activationMode="manual">
                <TabList>
                    {tabs.map((tab) => (
                        <Tab key={tab} value={tab} onClick={() => analytics.logEvent('faq_tab_click', { tab })}>
                            <Typography>{tab}</Typography>
                        </Tab>
                    ))}
                </TabList>
                {tabs.map((tab) => (
                    <TabContent key={tab} value={tab} tabIndex={undefined}>
                        <Accordion
                            type="single"
                            collapsible
                            onValueChange={(question) => {
                                if (question) analytics.logEvent('faq_opened', { question })
                            }}
                        >
                            {faq[tab].map(([question, answer]) => (
                                <AccordionItem key={question} summary={question} details={answer} />
                            ))}
                        </Accordion>
                    </TabContent>
                ))}
            </Tabs>
        </Stack>
    )
}
