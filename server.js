#!/usr/bin/env -S deno serve --allow-read=. --watch
import { marked } from "npm:marked"
import { serveDir } from "jsr:@std/http"

export default {
  async fetch(request) {
    const url = new URL(request.url)
    let path = url.pathname.match(/^\/([^/]+\.html)?$/)
    if (!path) {
      return serveDir(request, {
        fsRoot: ".",
      })
    }
    const filename = (path[1] || "README") + ".md"
    let content
    try {
      content = await Deno.readTextFile("./" + filename)
    } catch (error) {
      return new Response(null, { status: 404 })
    }
    const layout = await Deno.readTextFile("./_layouts/default.html")
    const vars = {
      content: marked(content).replace(/\.md">/g, '.html">'),
      "page.title": content.match(/^# (.+)$/m)?.[1],
    }
    const page = layout.replace(/{{(.+?)}}/g, (_, key) => vars[key] || "")
    return new Response(page, {
      headers: {
        "content-type": "text/html",
      },
    })
  },
}
