import Image from 'next/image'
import { memo } from 'react'

function VideoBackground() {
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

            <div className="fixed inset-0 -z-10 bg-secondary/60" />
        </>
    )
}

export default memo(VideoBackground)
