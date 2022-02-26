export const faq = {
    General: [
        [
            'What is live trivia?',
            'The game starts at the same time for everyone. Throughout the 10 minutes, we send out 12 questions with 3 answers each. If you answer correctly all of the questions, you split the prize fund of the game. It’s automatically added to your Solana wallet.\n\nYou can talk with other players in the chat between the questions.',
        ],
        [
            'What kind of questions are there?',
            'About general encyclopedic topics. Something you might expect in a bar quiz. We don’t ask hardcore questions about blockchains!',
        ],
        ['Do you have a host?', 'Nope, for now it’s just the questions and the chat. '],
        [
            'Can I play with friends?',
            'Absolutely! It’s actually more fun with friends. You can meet in-person or get in a Discord channel to help each other answer the questions. If no one knows the answer, split between the options, so at least one person goes forward.\n\nIf you invite a friend and they end up joining, you get an extra life to use in the game. It could be a great cause to help your friend set up a crypto wallet.',
        ],
        [
            'How do extra lives work?',
            'One extra life allows you to keep playing even if you missed a question: answered incorrectly or never answered at all. \n\nYou can only use one life per game. You can’t use extra lives on the 12th question.',
        ],
        [
            'How do you pay out prizes?',
            'The prizes are automatically deposited on your Solana account in a second after the 12th question. It happens automatically!',
        ],
        [
            'Why do you need crypto for this?',
            'Crypto payouts are instant and available everywhere in the planet. On-chain games are also cool for honesty and transparency: you can check we don’t tamper with prize funds and payout everyone who answered 12 questions correctly. \n\nEvery question answer is also stored on the blockchain, so other developers can build apps around our trivia. In crypto, any developer can create “Breakroom 2022 Wrapped”. We decided to go with Solana over Ethereum because of their low fees and high capacity.\n\nDon’t worry, we’ll help to set up everything you need to start playing. Once you are in the ecosystem, explore other apps in web3. It’s fun out there!',
        ],
        [
            'Does it work on my phone?',
            'Yes, it works on iOS. Create a Phantom wallet and visit our site using the browser within the app. ',
        ],
    ],
    Crypto: [
        [
            'What is Solana?',
            'Solana is a cryptocurrency and an engine for decentralized applications. You can buy things with Solana, send Solana to friends and exchange it to real money.\n\nDevelopers can build apps on top of Solana: accept payments from wallets and run transactions. A transaction could be a bet on an auction or a private message to another Solana user. Not all transactions are purchases.\n\nif you are familiar with Ethereum or Bitcoin, Solana is similar. You can buy it on Coinbase, store it in a wallet, use "smart contracts" and buy NFTs with it. But Solana is cheaper and requires different wallets. You can\'t make a transfer from Ethereum wallet to Solana wallet, but you can exchange them on Coinbase.',
        ],
        [
            'Why do you need a wallet to play?',
            'This is how all of web3 apps work: you connect your wallet to all of the apps you use. Your wallet will own your playing history in Breakroom, NFTs and tokens (unless, you will create different wallets for different services — which is very simple). You will be able to move between apps and services, not losing the data and assets you’ve collected.',
        ],
        [
            'How to create a wallet?',
            'Our recommended wallet is Phantom. It is available as a Chrome extension (if you play from your computer) or an iOS app. You can visit their website for detailed installation instructions. We also will guide you through the process, once you click “sign up for the game”.',
        ],
        [
            'How to withdraw money?',
            'You can withdraw your money using an exchange (Coinbase, FTX, Binance). Alternatively, you can keep your money in crypto and spend it within the ecosystem.',
        ],
    ],
    Partners: [
        [
            'Can my organization sponsor a game? What would we get for sponsoring a game?',
            'Yes! The sponsor provides the prize fund with a 10% service fee that is going to Breakroom. We prefer sponsorships in crypto, however, we are willing to work with more traditional approaches (we are a C-Corp in Delaware).\n\nAs a sponsor, you get a native shoutout in game announcements, notifications and a few times throughout the game. If you want to become a sponsor, fill sponsor form (https://breakroomshow.typeform.com/sponsors) or reach out to parterships@breakroom.show.\n\nBreakroom is a great way to spend your marketing budget: you give most of the money to the community; the players are new to crypto, but educated on the basics and already set up their wallets. You can combine sponsoring Breakroom with more traditional forms of marketing by launching targeted/influencer ads on a sponsored game announcement.',
        ],
        [
            'What kind of organization can sponsor games?',
            'We are accepting sponsors of any kind: DAOs, NFT collections, web3 apps & services. However, we keep the right to refuse serving a sponsor. For now, this decision is centralized. As game matures, we are willing to give the ability to define who can sponsor games to the community.',
        ],
        [
            'Can you host a private game for my organization?',
            'Yes. We can host private games to entertain your community (for example, NFT holders) or onboard your employees to crypto. Fill out private game form (https://breakroomshow.typeform.com/privategames) or reach out to partnerships@breakroom.show.',
        ],
    ],
    Community: [
        [
            'Are you planning to launch NFTs or start a DAO?',
            'We might in the future, but we don’t have immediate plans to do so. Our general goal is to build a sustainable organization that brings more people to web3 through games and social apps. ',
        ],
        [
            'Why aren’t there transaction confirmations windows throughout the game?',
            'We use “session accounts” to optimize UX. When starting a game, Breakroom creates a new wallet within the browser and stores its keys in the local storage. User sends a transfer of SOL to the browser wallet and records the browser wallet belongs to main wallet to the contract. During the game all transactions are initiated from the browser wallet. When the payouts are distributed, the contract pays out to the main wallet according to the created mapping and browser wallet activity.\n\nSession accounts allow us to create timers on questions without sacrificing user experience.',
        ],
        ['How can view the source code?', 'Check out our GitHub organization: https://github.com/BreakroomShow. '],
        [
            'How do you make money?',
            'We charge 10% of the prize fund from sponsors. Amounts of prize funds in announcements are already.\n\nCharging money for our services allows to build a sustainable organization focused on bringing more people to web3.',
        ],
        [
            'Can I contribute questions?',
            'Yes, thank you! Please fill out this form: https://breakroomshow.typeform.com/questions.',
        ],
    ],
} as const
