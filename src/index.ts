import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import Prerenderer from '@prerenderer/prerenderer'
import fontSpider from 'font-spider'
import { replaceHref, isHttp } from './utils'
import path from 'path'
import fs from 'fs'
const _chalk = import("chalk").then(m => m.default);

export const unpluginFactory: UnpluginFactory<Options | undefined> = options => {
  let rootPath = '' // 生成的绝对路径
  const routes = options?.routers || []
  const regex = /(<link[^>]+href=)(["'])([^"']+)["']/gi;
  return {
    name: 'unplugin-font-spider',
    vite: {
      configResolved(this, config) {
        const { root, build } = config
        const { outDir } = build
        rootPath = root + '/' + outDir
      },
      async closeBundle() {
        const htmlFiles: { contents: string, path: string }[] = []
        const prerenderer = new Prerenderer({
          staticDir: rootPath,
        })
        await prerenderer.initialize().then(() => {
          return prerenderer.renderRoutes(routes)
        }).then(async (renderedRoutes: any) => {
          renderedRoutes.forEach((renderedRoute: any) => {
            const html: string = renderedRoute.html.trim()
            let newHtml = html
            if (!isHttp(html.match(regex)?.[1] ?? ''))
              newHtml = html.replace(regex, replaceHref(rootPath));
            htmlFiles.push({
              contents: newHtml,
              path: renderedRoute.originalRoute
            })
          })

          await fontSpider.spider(htmlFiles, {}).then((webFonts: any[]) => {
            // 字体文件路径修改
            webFonts = webFonts.map((item) => {
              let { files } = item
              files = files.map((file: { url: string, format: string }) => {
                const { url } = file
                return {
                  ...file,
                  url: rootPath + url.split(':')[1]
                }
              })
              return {
                ...item,
                files
              }
            })
            return webFonts
          }).then((webFonts: any[]) => {
            return fontSpider.compressor(webFonts, {});
          }).then((webFonts: any[]) => {
            webFonts.forEach(async (webFont: any) => {
              const chalk = await _chalk;
              this.info('Font family ' + chalk.green(webFont.family));
              this.info('Original size ' + chalk.green(webFont.originalSize / 1000 + ' KB'),);
              this.info('Include chars ' + chalk.blue(webFont.chars));
              this.info('Font id ' + webFont.id,);
              this.info('CSS selectors ' + webFont.selectors.join(', '));
              webFont.files.forEach((file: any) => {
                if (fs.existsSync(file.url)) {
                  this.info('File ' + chalk.cyan(path.basename(file.url)) + ' created: ' +
                    chalk.green(file.size / 1000 + ' KB'));
                } else {
                  this.info(chalk.red('File ' + path.basename(file.url) + ' not created'));

                }
              });
            })

          })
          return prerenderer.destroy()
        })



      }

    }
  }
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
