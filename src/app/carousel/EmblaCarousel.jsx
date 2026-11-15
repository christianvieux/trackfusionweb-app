'use client'

import { useEffect } from 'react'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import { PrevButton, NextButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export default function EmblaCarousel({ slides, options, custom_settings, className = '' }) {
  const plugins = custom_settings?.autoPlay
    ? [Autoplay({ playOnInit: true, delay: 10000 })]
    : []

  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

  useEffect(() => {
    if (emblaApi) {
      // emblaApi ready — attach any listeners here
    }
  }, [emblaApi, options])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  return (
    <div className={`flex flex-col ${className}`}>

      {/* Slides share an intrinsic height so short screens can scroll the page. */}
      <div id="embla_slide_viewport" className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-stretch">
          {slides.map((slide, index) => (
            <div key={index} className="min-w-0 flex-[0_0_100%]">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Controls — always visible, never clipped */}
      <div className="flex shrink-0 flex-wrap items-center justify-center gap-8 px-4 py-3">
        {/* Prev / Next */}
        <div className="flex items-center gap-6 text-primary">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        {/* Dots */}
        <div className="flex items-center gap-3">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`size-3 rounded-full border-2 bg-transparent transition-colors ${
                selectedIndex === index ? 'border-primary bg-primary/30' : 'border-muted-foreground/40'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  )
}