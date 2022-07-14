// const tsconfig = require('./tsconfig.json');
// let rawAlias = tsconfig.compilerOptions.paths;
// let alias = {};

// for (let x in rawAlias) {
//     alias[x.replace('/*', '')] = rawAlias[x].map(
//         p => p.replace('/*', ''))[0];
// }

module.exports = function (api) {
    api.cache(true);
    // console.log(alias)

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ['module-resolver', {
                root: ['./'],
                alias: {
                    '@components': './src/components/',
                    '@views': './src/views/',
                    '@res': './src/res/',
                    '@assets': './assets/'
                },
            }],
        ],
    };
};