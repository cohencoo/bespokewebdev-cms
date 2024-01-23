/* eslint-disable no-restricted-globals */
const cms = {
    endpoint: "https://visioneerlist.herokuapp.com/bwd",
    modifications: {},
    origin: location.hostname,
    path: location.pathname,
    count: 1,
    elements: document.body.getElementsByTagName("*"),
    getInput: async function (label, content) {
        const btn =
            "width: 100%;padding: 10px;border-radius: 8px;border: 1px solid #ccc;cursor: pointer;font-size: 16px;font-family: inherit;"
        const backdrop = document.createElement("div")
        backdrop.style =
            "position: fixed;top: 0;left: 0;z-index: 99999;width: 100vw;height: 100vh;background: rgba(0, 0, 0, 0.5);webkit-backdrop-filter: blur(5px);backdrop-filter: blur(5px);opacity:0;transition:0.4s;"

        const modal = document.createElement("div")
        modal.style =
            "position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);background: white;padding: 16px;border-radius: 8px;width: 100%;max-width: 500px;color:black;"

        const input = document.createElement("textarea")
        input.placeholder = content
        input.value = content
        input.rows = 5
        input.style =
            "resize: vertical;font-size: 16px;font-family: inherit;width: 100%;padding: 10px;border-radius: 5px;border: 1px solid #ccc;margin: 10px 0;"

        const save = document.createElement("button")
        save.type = "submit"
        save.innerText = "Save changes"
        save.style =
            btn + "background: #0066ff !important; color: white !important; font-weight: 600;"

        const close = document.createElement("button")
        close.type = "button"
        close.innerText = "Cancel changes"
        close.style =
            btn + "margin-top: 10px; background: #ggg !important; color: black !important;"

        modal.innerText = label
        modal.appendChild(input)
        modal.appendChild(save)
        modal.appendChild(close)
        backdrop.appendChild(modal)
        document.body.appendChild(backdrop)
        close.addEventListener("click", () => backdrop.remove())
        backdrop.style.opacity = 1

        return new Promise((resolve) => {
            save.addEventListener("click", () => {
                resolve(input.value)
                backdrop.remove()
            })
        })
    },
    getToken: () => {
        try {
            const decrypt = (encoded) => {
                const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0))
                const applySaltToChar = (code) => textToChars("salt").reduce((a, b) => a ^ b, code)
                return encoded
                    .match(/.{1,2}/g)
                    .map((hex) => parseInt(hex, 16))
                    .map(applySaltToChar)
                    .map((charCode) => String.fromCharCode(charCode))
                    .join("")
            }
            return decrypt(new URL(window.location.href).searchParams.get("token"))
        } catch (err) {}
    },
    textNode: (element) => {
        for (let i = 0; i < element.childNodes.length; i++) {
            let child = element.childNodes[i]
            if (child.nodeType === Node.TEXT_NODE && /\S/.test(child.nodeValue)) return true
        }
        return false
    },
    handleElementClick: async (element) => {
        const id = element.getAttribute("cms-id")
        const isMobile = window.innerWidth < 768 ? true : false

        const text = isMobile
            ? prompt("Editing this text", document.querySelector(`[cms-id="${id}"]`).innerText)
            : await cms.getInput(
                  "Editing this text",
                  document.querySelector(`[cms-id="${id}"]`).innerText
              )

        if (text) {
            cms.modifications[id] = text
            await cms.updateDomain({ [id]: text })
            cms.update()
        }
    },
    update: () => {
        Object.keys(cms.modifications).forEach((key) => {
            const selector = document.querySelector(`[cms-id="${key}"]`)
            if (selector) selector.innerHTML = cms.modifications[key]
        })
    },
    fetch: async (url, data) => {
        try {
            const response = await fetch(cms.endpoint + url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) console.warn(response.statusText)
            return response.json()
        } catch (error) {
            return null
        }
    },
    getDomain: async () => {
        try {
            const response = await cms.fetch("/get-domain", {
                domain: cms.origin,
                path: cms.path,
            })
            if (!response.ok) console.warn(response.statusText)
            return response
        } catch (error) {
            return null
        }
    },
    updateDomain: async (modifications) => {
        try {
            const response = await cms.fetch("/update-domain", {
                domain: cms.origin,
                password: cms.getToken(),
                path: cms.path,
                modifications: modifications,
            })
            if (!response.ok) console.warn(response.statusText)
        } catch (error) {}
    },
}

for (let i = 0; i < cms.elements.length; i++) {
    const element = cms.elements[i]
    if (cms.textNode(element)) {
        element.setAttribute("cms-id", cms.count)
        cms.count++
    }
}

;(async () => {
    const data = await cms.getDomain()
    if (data) {
        cms.modifications = data
        cms.update()
    }

    if (cms.origin && cms.getToken()) {
        const response = await cms.fetch("/auth-domain", {
            domain: cms.origin,
            password: cms.getToken(),
        })
        if (response && cms.getToken() === response.password) {
            console.table(data)
            document.querySelectorAll("[cms-id]").forEach((element) => {
                element.style.border = "0.25px dotted red"
                element.style.borderRadius = "3px"

                element.addEventListener("click", (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    cms.handleElementClick(element)
                })
            })
        }
    }
})()
