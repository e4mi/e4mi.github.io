#!/usr/bin/env -S deno serve --allow-read=. --watch
import { marked } from "npm:marked"

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    let path = url.pathname.match(/^\/([^/]+\.html)?$/)
    if (!path) {
      return new Response(null, { status: 404 })
    }
    const filename = (path[1] || "README") + ".md"
    const content = await Deno.readTextFile("./" + filename)
    const layout = await Deno.readTextFile("./_layouts/default.html")
    const vars = {
      content: marked(content),
      title: content.match(/^# (.+)$/m)?.[1],
    }
    const page = layout.replace(/{{(.+?)}}/g, (_, key) => vars[key] || "")
    return new Response(page, {
      headers: {
        "content-type": "text/html",
      },
    })
  },
}
