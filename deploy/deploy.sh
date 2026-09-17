#!/usr/bin/env bash
#
# 服务器端更新脚本：拉取最新代码 -> 安装依赖 -> 构建 -> 重启 -> 健康检查
#
# 用法（在服务器上执行）：
#   bash deploy/deploy.sh
#
# 可用环境变量覆盖默认值：
#   APP_DIR  应用目录，默认 /www/wwwroot/portfolio
#   NODE_BIN Node 二进制目录，默认 /opt/node24/bin
#   PM2_NAME PM2 进程名，默认 portfolio
#   APP_PORT 应用端口，默认 3002
#
set -euo pipefail

APP_DIR="${APP_DIR:-/www/wwwroot/portfolio}"
NODE_BIN="${NODE_BIN:-/opt/node24/bin}"
PM2_NAME="${PM2_NAME:-portfolio}"
APP_PORT="${APP_PORT:-3002}"

# 子路径部署用 /portfolio；将来换成域名根路径时，把它设为空字符串即可
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH-/portfolio}"
export NEXT_PUBLIC_GITHUB_USERNAME="${NEXT_PUBLIC_GITHUB_USERNAME:-Bassia777}"
export PATH="$NODE_BIN:$PATH"

cd "$APP_DIR"

echo "==> 拉取最新代码"
# 国内服务器直连 GitHub 偶尔会很慢，直连超时后自动改走镜像加速。
# 如不需要该回退，把 GIT_MIRROR 设为空字符串即可。
GIT_MIRROR="${GIT_MIRROR-https://ghfast.top}"
GIT_TIMEOUT="${GIT_TIMEOUT-45}"
if ! timeout "$GIT_TIMEOUT" git pull --ff-only origin main; then
  if [ -z "$GIT_MIRROR" ]; then
    echo "!! 拉取失败（已禁用镜像回退），请检查网络"
    exit 1
  fi
  echo "!! 直连超时，改用镜像 $GIT_MIRROR 重试"
  git -c url."$GIT_MIRROR/https://github.com".insteadOf="https://github.com" \
    pull --ff-only origin main
fi

echo "==> 安装依赖"
npm ci

echo "==> 构建（2G 内存机器，限制堆大小避免 OOM）"
NODE_OPTIONS=--max-old-space-size=1536 npm run build

echo "==> 重启服务"
pm2 restart "$PM2_NAME" --update-env
pm2 save

echo "==> 健康检查"
sleep 3
curl -fsSL -o /dev/null -w "http://127.0.0.1:${APP_PORT}${NEXT_PUBLIC_BASE_PATH}/ -> %{http_code}\n" \
  "http://127.0.0.1:${APP_PORT}${NEXT_PUBLIC_BASE_PATH}/"

echo "==> 完成"
