/* 构建管线：把 tools/ 下的可读源码单行化后写入 _config.butterfly.yml 的 inject 段
 * 用法: node tools/build-inject.js
 * 源文件:
 *   tools/hero-dismiss.readable.js   首页横幅整屏跳转
 *   tools/hero-dismiss.readable.css  横幅收起状态样式
 *   tools/site-style.css             精装修样式
 * 注意: JS 内不要使用单引号（YAML 单引号字符串冲突），统一用双引号
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function onelineJS(file) {
  let js = fs.readFileSync(path.join(root, 'tools', file), 'utf8');
  js = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  js = js.replace(/\s*\n\s*/g, '').replace(/\s{2,}/g, ' ').trim();
  js = js.split("'").join('"');
  new Function(js); // 语法校验，出错直接抛
  return js;
}

function onelineCSS(file) {
  let css = fs.readFileSync(path.join(root, 'tools', file), 'utf8');
  css = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s{2,}/g, ' ').trim();
  return css;
}

const js = onelineJS('hero-dismiss.readable.js');
const heroCss = onelineCSS('hero-dismiss.readable.css');
const siteCss = onelineCSS('site-style.css');
const allCss = heroCss + ' ' + siteCss;

const cfgPath = path.join(root, '_config.butterfly.yml');
let cfg = fs.readFileSync(cfgPath, 'utf8');
const start = cfg.indexOf('# ----- 自定义注入');
if (start < 0) throw new Error('未找到注入块标记');
const lines = [
  '# ----- 自定义注入：横幅跳转 + 精装修样式（源码在 tools/，改完运行 node tools/build-inject.js 重新生成）-----',
  'inject:',
  '  head:',
  "    - '<style>" + allCss + "</style>'",
  '  bottom:',
  "    - '<script>" + js + "</script>'",
  ''
];
fs.writeFileSync(cfgPath, cfg.slice(0, start) + lines.join('\n'));

const yaml = require(path.join(root, 'node_modules', 'js-yaml'));
const parsed = yaml.load(fs.readFileSync(cfgPath, 'utf8'));
console.log('inject 重建完成: head', parsed.inject.head.length, '条 / bottom', parsed.inject.bottom.length, '条');
console.log('CSS 总长', allCss.length, '字符, JS 长度', js.length, '字符');
