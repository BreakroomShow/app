const ordinalRules = new Intl.PluralRules('en', {
    type: 'ordinal',
})

const suffixes: { [key in Intl.LDMLPluralRule]?: string } = {
    one: 'st',
    two: 'nd',
    few: 'rd',
    other: 'th',
}

export function ordinal(number: number) {
    const suffix = suffixes[ordinalRules.select(number)]

    if (!suffix) return number

    return number + suffix
}
