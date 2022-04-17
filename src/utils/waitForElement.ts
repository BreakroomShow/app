export function waitForElement(selector: string) {
    return new Promise<Element>((resolve) => {
        const element = document.querySelector(selector)

        if (element) {
            resolve(element)
            return
        }

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector)

            if (el) {
                resolve(el)
                observer.disconnect()
            }
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })
    })
}
