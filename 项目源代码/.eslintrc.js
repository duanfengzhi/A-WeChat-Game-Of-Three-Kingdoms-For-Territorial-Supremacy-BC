module.exports = {
    "env": {
        "amd": true,
        "es6": true,
        "browser": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": { 
        "ecmaVersion": 7,
        "sourceType": "module",
        "ecmaFeatures": 
        { // 添加ES特性支持，使之能够识别ES6语法
            "jsx": true
        }
    },
    "rules": {
        // 禁止条件表达式中出现赋值操作符
        "no-cond-assign": 2,
        // 禁用 console
        "no-console": 2,
        // 禁止 function 定义中出现重名参数
        "no-dupe-args": 2,
        // 禁止空语句块
        "no-empty": 2,
        //  禁止不必要的括号
        "no-extra-parens": 2,
        // 禁止在字符串和注释之外不规则的空白
        "no-irregular-whitespace": 2,
        // 强制把变量的使用限制在其定义的作用域范围内
        "block-scoped-var": 2,
        // 强制所有控制语句使用一致的括号风格
        "curly": 2,
        // 使用 === 替代 ==
        "eqeqeq": [2],
        // 禁止出现空函数.如果一个函数包含了一条注释，它将不会被认为有问题。
        "no-empty-function":2,
        // 禁用不必要的嵌套块
        "no-lone-blocks": 2,
        // 禁止使用多个空格
        "no-multi-spaces": 2,
        // 要求使用 let 或 const 而不是 var
        "no-var": 2,
        // 要求或禁止文件末尾存在空行
        "eol-last":2,
        // 要求或禁止在函数标识符和其调用之间有空格
        "func-call-spacing":2,
        // 强制使用一致的缩进
        "indent": ["error", 4],
        // 禁止空格和 tab 的混合缩进
        "no-mixed-spaces-and-tabs":2,
        // 强制分号出现在句子末尾
        "semi-style": ["error", "last"],
        // 使用未命名的变量
        "no-undef": 0,
        // 禁止多余的空行
        "no-multiple-empty-lines": ["error", {"max": 1}],
        //要求中缀操作符周围有空格
        "space-infix-ops": ["error", {"int32Hint": true}],
    }
};