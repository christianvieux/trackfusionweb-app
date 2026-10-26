import Image from 'next/image'

export default function VideoBackground({ playVideo = false }) {
    return (
        <>
            <div className="fixed inset-0 -z-30">
                <Image
                    src="/images/Dark_Background_2.png"
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
            </div>

            {playVideo && (
                <video
                    className="fixed inset-0 -z-20 h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                >
                    <source
                        src="https://christianvieux-trackfusionweb-storage-bucket.s3.us-east-1.amazonaws.com/videos/Background.mp4"
                        type="video/mp4"
                    />
                </video>
            )}

            <div className="fixed inset-0 -z-10 bg-secondary/60" />
        </>
    )
}
