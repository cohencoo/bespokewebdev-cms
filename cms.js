/* eslint-disable */
/* prettier-ignore */

const cms={endpoint:"https://visioneerlist.herokuapp.com/bwd",modifications:{},origin:location.hostname,path:location.pathname,token:new URL(window.location.href).searchParams.get("token"),count:1,elements:document.body.getElementsByTagName("*"),textNode(t){for(let e=0;e<t.childNodes.length;e++){let o=t.childNodes[e];if(o.nodeType===Node.TEXT_NODE&&/\S/.test(o.nodeValue))return!0}return!1},async handleElementClick(t){let e=t.getAttribute("cms-id"),o=prompt("Editing this text",document.querySelector(`[cms-id="${e}"]`).innerText);o&&(cms.modifications[e]=o,cms.update(),await cms.updateDomain(cms.modifications))},update(){Object.keys(cms.modifications).forEach(t=>{let e=document.querySelector(`[cms-id="${t}"]`);e&&(e.innerHTML=cms.modifications[t])})},async fetch(t,e){try{let o=await fetch(cms.endpoint+t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!o.ok)throw o.statusText;return o.json()}catch(s){return console.error(s),null}},async getDomain(){try{let t=await cms.fetch("/get-domain",{domain:cms.origin,path:cms.path});if(!t.ok)throw t.statusText;return t}catch(e){return console.error(e),null}},async updateDomain(t){try{let e=await cms.fetch("/update-domain",{domain:cms.origin,password:cms.token,path:cms.path,modifications:t});if(!e.ok)throw e.statusText}catch(o){console.error(o)}}};
for (let i = 0; i < cms.elements.length; i++) {
    let t = cms.elements[i]
    cms.textNode(t) && (t.setAttribute("cms-id", cms.count), cms.count++)
}
;(async () => {
    let t = await cms.getDomain()
    if ((t && ((cms.modifications = t), cms.update()), cms.origin && cms.token)) {
        let e = await cms.fetch("/auth-domain", { domain: cms.origin, password: cms.token })
        e &&
            cms.token === e.password &&
            document.querySelectorAll("[cms-id]").forEach((t) => {
                ;(t.style.boxShadow = "0 0 0 0.2px red"),
                    (t.style.borderRadius = "3px"),
                    t.addEventListener("click", (e) => {
                        e.preventDefault(), e.stopPropagation(), cms.handleElementClick(t)
                    })
            })
    }
})()
