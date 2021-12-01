const fs = require('fs')

fs.readFile('./package.json', 'utf8', (err, data) => {
    if (err) {
        return console.log(err)
    }

    const result = data.replace(
        'github:Solana-Game/clic-trivia',
        `git+https://${process.env.GITHUB_TOKEN}:x-oauth-basic@github.com/Solana-Game/clic-trivia.git`,
    )

    fs.writeFile('./package.json', result, 'utf8', (error) => {
        if (error) {
            return console.log(err)
        }
    })
})
