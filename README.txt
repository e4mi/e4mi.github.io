# emi1y4

just a coding [[catgirl.jpg]] 🐾
loving minimalist code and cute designs 😻

[[codegolf]]
[[blog]]

[[https://github.com/emi1y4/]]


# codegolf

[[events js]]
[[hooks js]]


# events js

// usage: let [emit, on] = e(), off = on()
e=(l=[])=>[v=>l.map(i=>i&&i(v)),c=>(c=l.push(c)-1,_=>l[c]=0)]


# hooks js

// usage: hook(() => { let [x, setX] = useState(1) })
;(c=>((hook=(f,d=[])=>((p,r)=>(...a)=>(p=c,c=[0,d],r=f(...a),c=p,r))()),useState=(v,[i,d]=c)=>[i in d?d[i]:d[i]=v,v=>d[i]=v,c[0]++]))()