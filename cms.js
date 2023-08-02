/* eslint-disable no-restricted-globals */
const cms = {
    endpoint: "https://visioneerlist.herokuapp.com/bwd",
    modifications: {},
    token: new URL(window.location.href).searchParams.get("token"),
    elements: document.body.getElementsByTagName("*"),
    textNode: (element) => {
        for (let i = 0; i < element.childNodes.length; i++) {
            let child = element.childNodes[i]
            if (child.nodeType === Node.TEXT_NODE && /\S/.test(child.nodeValue)) return true
        }
        return false
    },
    update: () => {
        Object.keys(cms.modifications).forEach((key) => {
            const selector = document.querySelector(`[cms-id="${key}"]`)
            if (selector) selector.innerHTML = cms.modifications[key]
        })
    },
    fetchWithAuth: async (url, data) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) throw new Error(`Request failed with status ${response.status}.`)
            return response.json()
        } catch (error) {
            alert("An error occurred. Please try again later.")
            console.error(error)
            return null
        }
    },
    getDomain: async () => {
        try {
            const response = await cms.fetchWithAuth(`${cms.endpoint}/get-domain`, {
                domain: cms.origin,
                path: cms.path,
            })
            if (!response) throw new Error("Failed to get domain.")
            return response
        } catch (error) {
            console.error(error)
            return null
        }
    },
    updateDomain: async (modifications) => {
        try {
            const response = await cms.fetchWithAuth(`${cms.endpoint}/update-domain`, {
                domain: cms.origin,
                password: cms.token,
                path: cms.path,
                modifications: modifications,
            })
            if (!response) throw new Error("Failed to update domain.")
            return response
        } catch (error) {
            console.error(error)
        }
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
    const response = await cms.getDomain()
    if (response) {
        cms.modifications = response
        cms.update()
    }
})()

if (cms.origin && cms.token) {
    async function handleElementClick(element) {
        const id = element.getAttribute("cms-id")
        const text = prompt(
            "Editing this text",
            document.querySelector(`[cms-id="${id}"]`).innerText
        )

        if (text) {
            cms.modifications[id] = text
            await cms.updateDomain(cms.modifications)
            cms.update()
        }
    }

    ;(async () => {
        const response = await cms.fetchWithAuth(`${cms.endpoint}/auth-domain`, {
            domain: cms.origin,
            password: cms.token,
        })
        if (response && cms.token === response.password) {
            document.querySelectorAll("[cms-id]").forEach((element) => {
                element.style.border = "0.5px dotted red"
                element.style.borderRadius = "3px"

                element.addEventListener("click", (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleElementClick(element)
                })
            })
        }
    })()
}
