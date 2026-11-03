export default function TrackPageLayout({ title, children, className = '' }) {
    return (
        <section
            id="track_page_layout"
            className={`flex h-max min-h-0 w-full max-w-7xl flex-col gap-3 self-center rounded-[14px] border border-success/40 bg-[rgba(8,8,22,.6)] p-3 text-foreground backdrop-blur-[6px] sm:p-4 ${className}`}
        >
            {title && (
                <h1 className="shrink-0 text-2xl font-semibold whitespace-nowrap text-foreground sm:text-3xl">
                    {title}
                </h1>
            )}

            {children}
        </section>
    )
}
