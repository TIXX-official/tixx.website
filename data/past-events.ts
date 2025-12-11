export interface MediaItem {
    type: "image" | "video" | "youtube";
    src: string;
    alt: string;
    span?: string; // grid-col-span
    rowSpan?: string; // grid-row-span
    title?: string;
    location?: string;
    objectFit?: "cover" | "contain";
}

export const PAST_EVENTS: MediaItem[] = [
    // 1. PGMNTIXX 
    // Vertical Video Poster -> Make it tall
    {
        type: "video",
        src: "/images/archive/pgmntixx-poster.mp4",
        alt: "PGMNTIXX Poster Video",
        span: "col-span-1",
        rowSpan: "row-span-2",
        title: "PGMNTIXX",
        location: "ORGASM VALLEY 2",
        objectFit: "cover", // Now that it's tall, cover should show most of it nicely.
    },
    {
        type: "image",
        src: "/images/archive/pgmntixx-1.jpg",
        alt: "PGMNTIXX Vibe",
        span: "col-span-1 md:col-span-2", // Make this wider to balance
        title: "PGMNTIXX",
        location: "ORGASM VALLEY 2",
        objectFit: "cover",
    },

    // 2. NASTIXX (YouTube + Poster)
    {
        type: "video",
        src: "/images/archive/nastixx-poster.mp4",
        alt: "NASTIXX Poster Video",
        span: "col-span-1",
        rowSpan: "row-span-2",
        title: "NASTIXX",
        location: "BOLERO",
        objectFit: "contain",
    },
    {
        type: "youtube",
        src: "https://www.youtube.com/embed/hXdQUvAQc5w",
        alt: "NASTIXX at BOLERO",
        span: "col-span-1",
        title: "NASTIXX",
        location: "BOLERO",
        objectFit: "cover",
    },
    {
        type: "youtube",
        src: "https://www.youtube.com/embed/OlaANI8m-EA",
        alt: "NASTIXX Vibe",
        span: "col-span-1",
        title: "NASTIXX",
        location: "BOLERO",
        objectFit: "cover",
    },
    {
        type: "youtube",
        src: "https://www.youtube.com/embed/pVbsqp74_1Y",
        alt: "NASTIXX Atmosphere",
        span: "col-span-1",
        title: "NASTIXX",
        location: "BOLERO",
        objectFit: "cover",
    },

    // 3. DIRTIXX 
    // Vertical Video Poster -> Tall
    {
        type: "video",
        src: "/images/archive/dirtixx-poster.mp4",
        alt: "DIRTIXX Poster Video",
        span: "col-span-1",
        rowSpan: "row-span-2",
        title: "DIRTIXX",
        location: "FRAME",
        objectFit: "cover",
    },
    {
        type: "image",
        src: "/images/archive/dirtixx-1.jpg",
        alt: "DIRTIXX Photo",
        span: "col-span-1 md:col-span-2",
        title: "DIRTIXX",
        location: "FRAME",
        objectFit: "cover",
    },


    // 4. GETIXX (Poster Image -> Tall)
    {
        type: "image",
        src: "/images/archive/getixx-poster.jpg",
        alt: "GETIXX Poster",
        span: "col-span-1",
        rowSpan: "row-span-2",
        title: "GETIXX",
        location: "TIMES APGU",
        objectFit: "cover",
    },
    {
        type: "image",
        src: "/images/archive/getixx-2.jpg",
        alt: "GETIXX Photo 1",
        span: "col-span-1",
        title: "GETIXX",
        location: "TIMES APGU",
        objectFit: "cover",
    },
    {
        type: "image",
        src: "/images/archive/getixx-3.jpg",
        alt: "GETIXX Photo 2",
        span: "col-span-1",
        title: "GETIXX",
        location: "TIMES APGU",
        objectFit: "cover",
    },
];
