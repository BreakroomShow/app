import { Box, styled } from '../../../design-system'

export const PageContent = styled(Box, {
    paddingX: 85,
    '@down-lg': { paddingX: 40 },
    '@down-md': { paddingX: 20 },

    maxWidth: 1272,
    marginX: 'auto',
})
