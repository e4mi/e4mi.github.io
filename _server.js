#!/usr/bin/env -S deno serve --allow-read=. --watch
import { marked } from "npm:marked"
import { serveDir } from "jsr:@std/http"

export default {
  async fetch(request) {
    const url = new URL(request.url)
    let path = url.pathname.match(/^\/([^/]+)\.html?$/)
    if (url.pathname === "/") {
      path = [0, "README"]
    }
    if (!path) {
      return serveDir(request, {
        fsRoot: ".",
      })
    }
    const filename = (path[1]) + ".md"
    let content
    try {
      content = await Deno.readTextFile("./" + filename)
    } catch (error) {
      return new Response(null, { status: 404 })
    }
    const layout = await Deno.readTextFile("./_layouts/default.html")
    let title = ""
    content = content.replace(/^---\n([\s\S]*\n)?title: (.+)[\s\S]*\n---\n/, (a, b, t) => {
      title = t
      return ""
    })
    const vars = {
      content: marked(content).replace(/\.md">/g, '.html">'),
      "page.title": title,
    }
    const page = layout.replace(/{{(.+?)}}/g, (_, key) => vars[key] || "")
    return new Response(page, {
      headers: {
        "content-type": "text/html",
      },
    })
  },
}
