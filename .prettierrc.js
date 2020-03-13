module.exports = {
    arrowParens: 'always',
    bracketSpacing: true,
    endOfLine: 'lf',
    printWidth: 80,
    quoteProps: 'consistent',
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: false,
    overrides: [
        {
            files: '*.md',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
