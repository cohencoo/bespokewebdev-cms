export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export async function API(
    endpoint: string,
    url: string,
    data?: any,
    callback?: any,
    errorCallback?: any
) {
    try {
        const response = await fetch(endpoint + url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
        if (!response.ok) throw response
        if (callback) callback(await response.json())
    } catch (error) {
        if (errorCallback) errorCallback(error)
    }
}

export const toastStyles: any = {
    borderRadius: "10px",
    background: "#eee",
    color: "#000",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
    pointerEvents: "none",
}

export const toastID = (id: string): any => {
    return {
        id: id,
        duration: 4000,
        position: "top-right",
        style: toastStyles,
    }
}

export async function generateSitemap(website: string) {
    const sitemap = [] as any
    const visitedPages = new Set()

    async function fetchPage(url: string) {
        try {
            const response = await fetch(url)
            if (!response.ok) return null
            const text = await response.text()
            return text
        } catch (error) {
            return null
        }
    }

    async function extractSubpages(url: string) {
        if (visitedPages.has(url)) return
        visitedPages.add(url)
        const pageContent = await fetchPage(url)
        if (!pageContent) return

        const doc = new DOMParser().parseFromString(pageContent, "text/html")
        doc.querySelectorAll("a").forEach((link) => {
            const href = link.getAttribute("href")
            if (href && href !== "/" && href.endsWith(".html")) {
                let subpage = new URL(href, url).href
                subpage = subpage.split("#")[0]
                sitemap.push(subpage)
                extractSubpages(subpage)
            }
        })
    }

    await extractSubpages(website)
    return sitemap
}
