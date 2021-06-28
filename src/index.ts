import {
    AvatarRewriter,
    BodyRewriter,
    HeadRewriter,
    LinkRewriter,
    NameRewriter,
    ProfileRewriter,
    SocialRewriter,
    TitleRewriter,
} from "./rewriters"
import links from "./links"
import {Router} from "itty-router"

const router = Router()

router.get("/links", () => {
    const response = new Response(JSON.stringify(links), {
        headers: {"content-type": "application/json"},
    })

    return response
})

router.get("*", async () => {
    const htmlResponse = await fetch(
        "https://static-links-page.signalnerve.workers.dev",
    )

    const response = new HTMLRewriter()
        .on("body", new BodyRewriter())
        .on("head", new HeadRewriter())
        .on("title", new TitleRewriter())
        .on("#profile", new ProfileRewriter())
        .on("#avatar", new AvatarRewriter())
        .on("#name", new NameRewriter())
        .on("#links", new LinkRewriter())
        .on("#social", new SocialRewriter())
        .transform(htmlResponse)

    return response
})

router.all("*", () => {
    const response = new Response(
        "Error: This service only accepts GET requests.",
        {
            status: 500,
            headers: {"content-type": "text/plain"},
        },
    )

    return response
})

addEventListener("fetch", event => {
    event.respondWith(router.handle(event.request))
})
