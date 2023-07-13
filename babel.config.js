module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset',
        ["@babel/env", { "modules": false }]
    ],
    env: {
        development: {
            plugins: [
                'dynamic-import-node',
                [
                    'component',
                    {
                    'libraryName': 'element-ui',
                    'styleLibraryName': 'theme-chalk'
                    }
                ]
            ]
    }
}
}
