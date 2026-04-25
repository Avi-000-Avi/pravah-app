module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.native.js'],
          alias: {
            '@': './src',
            '@/features': './src/features',
            '@/lib': './src/lib',
            '@/components': './src/components',
            '@/hooks': './src/hooks',
            '@/types': './src/types',
          },
        },
      ],
    ],
  };
};
