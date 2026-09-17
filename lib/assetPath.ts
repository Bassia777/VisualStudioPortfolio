const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * 给 `public/` 目录下的静态资源补上部署前缀（basePath）。
 *
 * Next 16 的 `next/image` 不会把 basePath 加到本地资源的 src 上，
 * 子路径部署时会出现图标 404、图片优化接口返回 400 的情况；
 * 这里显式补前缀即可。本地未设置 basePath 时原样返回，行为不变。
 */
export const assetPath = (path: string) => `${basePath}${path}`;
