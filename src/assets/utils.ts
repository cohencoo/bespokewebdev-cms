export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

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
