module.exports = function override(webpackConfig) {
    webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
    })

    webpackConfig.externals = [
        (context, request, callback) => {
            if (request === 'three' && context.includes('framer-motion-3d')) {
                return callback(null, {
                    commonjs: 'three',
                    commonjs2: 'three',
                    amd: 'three',
                    root: 'THREE',
                })
            }
            callback()
        },
    ]

    return webpackConfig
}
