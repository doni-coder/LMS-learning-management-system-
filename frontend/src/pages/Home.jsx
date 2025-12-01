import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import GlassyRippleButton from "@/components/GlassyRippleButton";

function Home() {
  const slides = [
    {
      img: "https://img-c.udemycdn.com/notices/web_carousel_slide/image_responsive/c4b627d6-7de4-4ec2-915b-541224a631e1.jpg",
      desc: "Boost your skills with top-quality courses crafted by industry experts.",
    },
    {
      img: "https://img-c.udemycdn.com/notices/web_carousel_slide/image_responsive/726d09d8-71f4-441b-b059-5bfa139b6888.png",
      desc: "Gain the knowledge you need to excel in your career and personal growth.",
    },
    {
      img: "https://img-c.udemycdn.com/notices/web_carousel_slide/image_responsive/dcec98bf-fe61-40f1-b5cb-e8997795ba3e.png",
      desc: "Our instructors are industry leaders with years of hands-on experience.",
    },
  ];

  return (
    <section className="relative h-[90vh] text-white">
      <div className="w-full mt-0 flex justify-center">
        <div className="w-full md:w-[90%] relative z-50">
          <Carousel
            className="relative"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="basis-full relative">
                  {/* Background Image */}
                  <div
                    className="w-full relative h-[400px] overflow-hidden md:rounded-[15px] bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${slide.img}')`,
                    }}
                  >
                    {/* Overlay Content */}
                    <div
                      className="absolute h-fit bottom-[-1px]  left-0 text-center w-full flex flex-col justify-center px-6 py-5 
                    bg-black/20 backdrop-blur-md border border-white/20  md:px-12"
                    >
                      <h1 className="text-xl md:text-3xl font-bold drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <div className="flex justify-center">
                        <p className="mt-2 text-sm md:text-base text-center text-gray-200 max-w-md">
                          {slide.desc}
                        </p>
                      </div>
                      {/* <div className="mt-4 flex justify-center gap-3">
                        <a
                          href="/signup"
                          className="bg-[#00f0ff] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00d4ff] transition"
                        >
                          Get Started
                        </a>
                        <a
                          href="/courses"
                          className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition"
                        >
                          Browse Courses
                        </a>
                      </div> */}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Controls */}
            <CarouselPrevious className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </div>
       
      </div>
      <div className="mt-20 md:mt-22">
        <GlassyRippleButton/>
      </div>
    </section>
  );
}

export default Home;
