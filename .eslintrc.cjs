module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended' // prettier配置
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'react-refresh/only-export-components': 0,
    camelcase: 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 'off',
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'react-hooks/rules-of-hooks': 0,
    'default-param-last': 0,
    'react/jsx-filename-extension': 0, // 关闭airbnb对于jsx必须写在jsx文件中的设置
    'react/prop-types': 'off', // 关闭airbnb对于必须添加prop-types的校验
    'react/destructuring-assignment': 'off',
    'react/jsx-one-expression-per-line': 'off', // 关闭要求一个表达式必须换行的要求，和Prettier冲突了
    'react/jsx-wrap-multilines': 0, // 关闭要求jsx属性中写jsx必须要加括号，和Prettier冲突了
    'react/jsx-first-prop-new-line': 0,
    'react/prefer-stateless-function': 0,
    'jsx-a11y/no-static-element-interactions': 'off', // 关闭非交互元素加事件必须加 role
    'jsx-a11y/click-events-have-key-events': 'off', // 关闭click事件要求有对应键盘事件
    'jsx-a11y/no-noninteractive-tabindex': 'off',
    'no-bitwise': 'off', // 不让用位操作符，不知道为啥，先关掉
    'react/jsx-indent': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-no-undef': 0,
    'no-empty-pattern': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'jsx-control-statements/jsx-use-if-tag': 0,
    'react/no-array-index-key': 0,
    'react/jsx-props-no-spreading': 0,
    'no-param-reassign': 0, // redux/toolkit使用immer库, 保证数据不被修改
    // 禁止使用 var
    'no-var': 'off',
    'no-shadow': 'off',
    // 可以使用 debugger
    // 'no-debugger': 'off',
    'no-unused-expressions': 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    semi: 0,
    quotes: 'off',
    // @fixable 必须使用 === 或 !==，禁止使用 == 或 !=，与 null 比较时除外
    eqeqeq: 0,
    'no-use-before-define': 0,
    'prefer-const': 'off',
    'import/order': 'off',
    'prefer-destructuring': 'off',
    'spaced-comment': 'off',
    'space-before-function-paren': 'off',
    'react/jsx-indent-props': 'off',
    'no-console': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'no-nested-ternary': 'off',
    'react/self-closing-comp': 'off',
    'prefer-template': 'off',
    'react/no-unused-prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-boolean-value': 'off',
    'import/no-named-default': 'off',
    'func-names': 'off',
    'dot-notation': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'vars-on-top': 'off',
    'consistent-return': 'off',
    'no-else-return': 'off',
    'import/newline-after-import': 'off',
    'no-return-await': 'off',
    'no-lonely-if': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-unneeded-ternary': 'off',
    'operator-assignment': 'off',
    'no-useless-return': 'off',
    'one-var': 'off',
    'global-require': 'off',
    'class-methods-use-this': 'off',
    'import/no-duplicates': 'off',
    'comma-dangle': 'off',
    'react-hooks/exhaustive-deps': 'off',
    radix: 'off',
    'prettier/prettier': 'off',
    'no-underscore-dangle': 'off',
    'no-restricted-properties': 'off',
    'react/jsx-no-target-blank': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-await-in-loop': 'off',
    'array-callback-return': 'off',
    'react/no-danger': 'off',
    'linebreak-style': [0, 'error', 'windows']
  }
}
