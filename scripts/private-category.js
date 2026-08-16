/* 「私密」分类自动加密
 * 凡分类名包含「私密」的文章，构建时自动：
 *   - 挂上密码（默认 721196，文章里显式写 password 则以文章为准）
 *   - 补齐加密提示文案（防止摘要泄露正文）
 *   - 使用高强度密钥派生（PBKDF2 60 万次迭代，提高暴力破解成本）
 * Hexo 会自动加载 scripts/ 目录下的本文件，无需其他配置
 */
hexo.extend.filter.register('before_post_render', function (data) {
  if (!data.categories) return data;

  var names = [];
  try {
    data.categories.forEach(function (c) {
      names.push(String((c && (c.name || c.slug)) || c));
    });
  } catch (e) {
    names.push(String(data.categories));
  }

  var isPrivate = names.some(function (n) { return n.indexOf('私密') >= 0; });
  if (!isPrivate) return data;

  if (!data.password) data.password = '721196';
  if (!data.abstract) data.abstract = '<div><i class="fas fa-lock"></i> 私密文章，输入验证码后可见</div>';
  if (!data.message) data.message = '<i class="fas fa-key"></i> 私密文章，请输入验证码';
  if (!data.description) data.description = '🔒 私密文章，输入验证码后可见全文';
  if (!data.kdf) data.kdf = { iterations: 600000 };

  return data;
});
