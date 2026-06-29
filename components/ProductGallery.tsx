"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import type { CarouselApi } from "@/components/ui/carousel";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ProductImage } from "@/types/product";

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [thumbApi, setThumbApi] = useState<CarouselApi>();

  const selectImage = (index: number) => {
    setSelectedIndex(index);
  };

  const nextImage = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!thumbApi) return;

    thumbApi.scrollTo(selectedIndex);
  }, [selectedIndex, thumbApi]);

  if (!images.length) return null;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={images[selectedIndex].imageUrl}
            alt={`Product image ${selectedIndex + 1}`}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <button
          type="button"
          onClick={prevImage}
          className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
        >
          <FiChevronLeft size={24} />
        </button>

        <button
          type="button"
          onClick={nextImage}
          className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      <div className="relative px-12">
        <Carousel
          setApi={setThumbApi}
          opts={{
            align: "center",
            dragFree: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={image.id} className="basis-1/3 md:basis-1/4">
                <button
                  type="button"
                  onClick={() => selectImage(index)}
                  className={`relative aspect-square w-full overflow-hidden rounded-md border-2 transition ${
                    selectedIndex === index
                      ? "border-[#ef4444]"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image.imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
