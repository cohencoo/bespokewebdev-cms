/* eslint-disable no-restricted-globals */
const cms = {
    endpoint: "https://visioneerlist.herokuapp.com/bwd",
    modifications: {},
    origin: location.hostname,
    path: location.pathname,
    count: 1,
    elements: document.body.getElementsByTagName("*"),
    getToken: () => {
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
        const text = prompt(
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
