class Email extends String {
    toUrl = () => `mailto:${this}`
}

export const urls = {
    pages: {
        connect: '/connect',
        welcome: '/welcome',
    },
    external: {
        github: 'https://github.com/BreakroomShow',
        octane: 'https://github.com/solana-labs/octane',
        phantom: 'https://phantom.app/',
        bot: 'https://t.me/BreakroomShowBot',
    },
    emails: {
        breakroom: new Email('hello@breakroom.show'),
        partnerships: new Email('partnerships@breakroom.show'),
    },
    forms: {
        questions: 'https://breakroomshow.typeform.com/questions',
        sponsors: 'https://breakroomshow.typeform.com/sponsors',
        privateGame: 'https://breakroomshow.typeform.com/privategames',
    },
    guides: {
        installWallet: '/',
        connectWallet: '/',
        depositWallet: '/',
    },
}
