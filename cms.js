const cms = {
    endpoint: "https://visioneerlist.herokuapp.com/bwd",
    instructions: {},
    domain: new URL(window.location.href).searchParams.get("q"),
    token: new URL(window.location.href).searchParams.get("token"),
    count: 1,
    elements: document.body.getElementsByTagName("*"),
    textNode: (element) => {
        if (!element || !element.hasChildNodes()) return false
        for (const node of element.childNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== "br")
                return false
        }
        return true
    },
    update: () => {
        Object.keys(cms.instructions).forEach((key) => {
            const [selector, replacement] = [
                document.querySelector(`[cms-id="${key}"]`),
                cms.instructions[key],
            ]
            if (selector) selector.innerHTML = replacement
        })
    },
}

for (let i = 0; i < cms.elements.length; i++) {
    const element = cms.elements[i]
    if (cms.textNode(element)) {
        element.setAttribute("cms-id", cms.count)
        cms.count++
    }
}

// eslint-disable-next-line no-restricted-globals
fetch(`${cms.endpoint}/get-domain/${location.hostname}`)
    .then((response) => response.json())
    .then((data) => {
        cms.instructions = data
        cms.update()
    })

if (cms.domain && cms.token) {
    async function authenticate(domain, password) {
        try {
            const response = await fetch(`${cms.endpoint}/auth-domain`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    domain: domain,
                    password: password,
                }),
            })

            if (!response.ok) {
                if (response.status === 404) {
                    alert("This domain has not been registered for Bespoke Web Dev CMS")
                } else if (response.status === 400) {
                    alert("Missing required fields")
                } else {
                    alert("An error occurred. Please try again later.")
                }
                return null
            }

            return response.json()
        } catch (error) {
            alert("An error occurred. Please try again later.")
            console.error(error)
            return null
        }
    }

    async function updateDomain(domain, password, instructions) {
        try {
            const response = await fetch(`${cms.endpoint}/update-domain`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    domain: domain,
                    password: password,
                    modifications: instructions,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to update domain.")
            }

            console.log("Saved!")
        } catch (error) {
            alert("An error occurred. Please try again later.")
            console.error(error)
        }
    }

    async function handleElementClick(element, cms) {
        const id = element.getAttribute("cms-id")
        const text = prompt(
            "Editing this text",
            document.querySelector(`[cms-id="${id}"]`).innerText
        )

        if (text) {
            cms.instructions[id] = text
            await updateDomain(cms.domain, cms.token, cms.instructions)
            cms.update()
        }
    }

    ;(async () => {
        const response = await authenticate(cms.domain, cms.token)
        if (response && cms.token === response.password) {
            document.querySelectorAll("[cms-id]").forEach((element) => {
                element.style.border = "1px dotted red"
                element.style.borderRadius = "3px"

                element.addEventListener("click", (e) => {
                    e.preventDefault()
                    handleElementClick(element, cms)
                })
            })
        }
    })()
}
