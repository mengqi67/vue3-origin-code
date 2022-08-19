/*
 * @Author: ymq
 * @Date: 2022-08-19 18:20:10
 * @LastEditors: ymq
 * @LastEditTime: 2022-08-19 18:50:27
 * @Description: 
 */

// minimist用来解析命令行传参的 
const args = require('minimist')(process.argv.slice(2))  // node scripts/dev.js reactivity -f global
const { resolve } = require('path')
const { build } = require('esbuild')

const target = args._[0] || 'reactivity';
const format = args.f || 'global';

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))


// iife 立即执行函数 (function(){})()
// cjs node中的模块 module.exports
// esm 浏览器中的esModule模块 import
const outputFormat = format.startsWith('global') ? 'iife': format === 'cjs' ? 'cjs' : 'esm'

const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,   // 把所有包全部打到一起
    sourcemap: true,
    format: outputFormat,   // 输出的格式
    globalName: pkg.buildOptions?.name,     // 打包的全局的名字
    platform: format === 'cjs' ? 'node' : 'browser',    // 运行环境
    watch: {    // 监控文件变化
        onRebuild(error) {
            if (!error) console.log('rebuilt~~~')
        }
    }
}).then(() => {
    console.log('watching~~~~~');
    
})