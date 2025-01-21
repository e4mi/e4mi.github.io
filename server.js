import { marked } from "https://cdn.skypack.dev/marked"

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
    const html = marked(content)
    return new Response(content, {
      headers: {
        "content-type": "text/html",
      },
    })
  },
}
