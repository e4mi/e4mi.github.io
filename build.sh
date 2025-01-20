#!/bin/sh -xe
for file in *.md; do
  content=`sed -e 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g; s/\!\[\([^)]*\)\](\([^)]*\))/<img src="\2" alt="\1">/g; s/\[\([^)]*\)\](\([^)]*\))/<a href="\2">\1<\/a>/g' "$file"`
  title=`head -n 1 "$file" | sed -e 's/^# //'`
  if [ "$file" = "README.md" ]; then
    file="index.md"
  fi
  cat <<EOF > "${file%.md}.html"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>$title</title> 
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@500"
      rel="stylesheet"
    />
    <style>
      html {
        color-scheme: light dark;
        color: light-dark(black, white);
        background-color: light-dark(white, black);
      }
      body {
        font: 20px/1.5 "Noto Serif", serif;
        max-width: 40rem;
        padding: 1rem;
      }
      * {
        font: inherit;
        margin: 0;
        background: none;
        border: none;
      }
      h1, h2, h3 {
        font-weight: bold;
        font-size: 2rem;
      }
    </style>
  </head>
  <body>
    $content
  </body>
</html>
EOF
done
