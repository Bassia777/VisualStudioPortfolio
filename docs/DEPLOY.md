# 部署到腾讯云轻量服务器

本文记录本项目的服务器部署方式与日常更新流程。

## 服务器现状（部署前已确认）

| 项目 | 值 |
| --- | --- |
| 系统 | OpenCloudOS 9.4（x86_64，等同于 RHEL 9 系） |
| 配置 | 2 核 2G / 50G SSD / 4Mbps |
| 面板 | 宝塔面板（8888），nginx 1.30 由面板管理 |
| 已有站点 | `/www/wwwroot/blog/BlogSystem`，80 端口，Node API 由 PM2 托管在 3001 |
| 对外放行端口 | 仅 22 / 80 / 888 / 8888 |

因为 80 端口已经被旧站点占用、且没有可用域名，作品集采用**子路径反向代理**的方式接入：
nginx 在 80 端口把 `/portfolio` 的请求转发给运行在 `127.0.0.1:3002` 的 Next.js 服务。
旧站点完全不受影响。

## 部署结构

| 组件 | 位置 |
| --- | --- |
| 应用代码 | `/www/wwwroot/portfolio`（git clone 自 GitHub） |
| Node 运行时 | `/opt/node24`（Node 24 LTS，独立于系统的 Node 18） |
| 进程管理 | PM2，进程名 `portfolio` |
| 监听地址 | `127.0.0.1:3002`，仅本机可访问，由 nginx 对外 |
| 访问地址 | http://106.53.218.28/portfolio/ |
| 构建期环境变量 | `.env.production.local`（已被 gitignore，不入库） |

> 使用独立目录 `/opt/node24` 的原因：系统自带 Node 18 正在给旧博客的 API 服务使用，
> 直接升级会影响已有服务。

## 日常更新（改完代码之后）

本地推送后，在服务器上执行一条命令即可：

```bash
bash /www/wwwroot/portfolio/deploy/deploy.sh
```

脚本会依次完成：`git pull` → `npm ci` → `npm run build` → `pm2 restart portfolio` → 健康检查。

> 国内服务器直连 GitHub 偶尔会卡住，脚本对 `git pull` 设了 45 秒超时，
> 超时后自动改走镜像加速（`GIT_MIRROR`，默认 `https://ghfast.top`）重试。
> 不需要这个回退可以把 `GIT_MIRROR=''` 传给脚本。git 对象带哈希校验，
> 镜像只能影响速度，无法篡改内容。

## 首次部署（换新服务器时的完整步骤）

```bash
# 1) 安装独立 Node 运行时
cd /opt
curl -fsSL -o node24.tar.gz https://nodejs.org/dist/v24.21.0/node-v24.21.0-linux-x64.tar.gz
tar -xzf node24.tar.gz && mv node-v24.21.0-linux-x64 node24

# 2) 拉取代码
git clone https://github.com/Bassia777/VisualStudioPortfolio.git /www/wwwroot/portfolio
cd /www/wwwroot/portfolio

# 3) 构建期环境变量
cat > .env.production.local <<'EOF'
NEXT_PUBLIC_GITHUB_USERNAME=Bassia777
NEXT_PUBLIC_BASE_PATH=/portfolio
EOF

# 4) 安装依赖并构建
export PATH=/opt/node24/bin:$PATH
NODE_OPTIONS=--max-old-space-size=1536 npm ci
NODE_OPTIONS=--max-old-space-size=1536 npm run build

# 5) 用 PM2 常驻运行
pm2 start /opt/node24/bin/node --name portfolio -- \
  /www/wwwroot/portfolio/node_modules/next/dist/bin/next start -p 3002 -H 127.0.0.1
pm2 save
```

## nginx 配置

把 `deploy/nginx-portfolio.conf` 里的 `location ^~ /portfolio` 段落加入现有站点的 `server{}`
（宝塔面板：网站 → 设置 → 配置文件），保存后重载：

```bash
/www/server/nginx/sbin/nginx -t && /www/server/nginx/sbin/nginx -s reload
```

要点说明：

- 必须用 `^~` 前缀匹配，否则该站点里针对 `.js` / `.css` 的正则 location 会先命中，
  静态资源会被当成站点根目录下的文件而 404。
- `proxy_pass` 结尾**不带**斜杠，路径原样透传给 Next.js，与 `basePath=/portfolio` 对齐。
- 该站点配置文件由宝塔面板生成，若日后在面板里重新保存站点设置导致片段丢失，
  重新贴一次即可。

## 换成独立域名（推荐）

子路径只是「今天就能访问」的过渡方案。拿到域名后建议切成独立站点：

1. 域名解析 A 记录指向 `106.53.218.28`；
2. 宝塔新建站点（域名填你的域名，不要选 PHP），反向代理到 `http://127.0.0.1:3002`；
3. 服务器上把 `.env.production.local` 的 `NEXT_PUBLIC_BASE_PATH` 改成空值，重新构建：

```bash
cd /www/wwwroot/portfolio
sed -i 's|^NEXT_PUBLIC_BASE_PATH=.*|NEXT_PUBLIC_BASE_PATH=|' .env.production.local
NEXT_PUBLIC_BASE_PATH= NODE_OPTIONS=--max-old-space-size=1536 /opt/node24/bin/npm run build
pm2 restart portfolio --update-env
```

4. 若要 HTTPS，先在腾讯云控制台放行 443，再用面板一键申请 Let's Encrypt 证书。

## 常见排查

```bash
pm2 status                      # 进程状态
pm2 logs portfolio --lines 50   # 应用日志
curl -I http://127.0.0.1:3002/portfolio/   # 绕过 nginx 直连应用
/www/server/nginx/sbin/nginx -t            # nginx 配置语法
tail -50 /www/wwwlogs/106.53.218.28.error.log
```

构建阶段 OOM 时，先确认 swap 可用（`swapon --show`），必要时临时扩大 swap 后重试。

`git pull` 长时间无响应时，可直接用镜像手动拉取：

```bash
cd /www/wwwroot/portfolio
git -c url."https://ghfast.top/https://github.com".insteadOf="https://github.com" pull --ff-only origin main
```
