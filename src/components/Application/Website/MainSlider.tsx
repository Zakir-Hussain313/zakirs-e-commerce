'use client';

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import slider1 from '../../../../public/assets/images/slider-1.png';
import slider2 from '../../../../public/assets/images/slider-2.png';
import slider3 from '../../../../public/assets/images/slider-3.png';
import slider4 from '../../../../public/assets/images/slider-4.png';
import { LuChevronRight, LuChevronLeft } from 'react-icons/lu';

const ArrowPrev = (props) => {
  const { onClick } = props;
  return (
    <button onClick={onClick} type='button' className='w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 translate-y-1/2 bg-white left-10 cursor-pointer'>
      <LuChevronLeft size={30} className='text-gray-600' />
    </button>
  )
}

const ArrowNext = (props) => {
  const { onClick } = props;
  return (
    <button onClick={onClick} type='button' className='w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 translate-y-1/2 bg-white right-10 cursor-pointer'>
      <LuChevronRight size={30} className='text-gray-600' />
    </button>
  )
}


const MainSlider = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrev />,

    responsive: [
      {
        breakpoint: 768, // tablets and below
        settings: {
          arrows: false, // ✅ correct
          dots: false,
        },
      },
      {
        breakpoint: 480, // mobile
        settings: {
          arrows: false,
          dots: false,
        },
      },
    ],
  };

  const slides = [slider1, slider2, slider3, slider4];

  return (
    <div>
      <Slider {...settings}>
        {slides.map((slide, idx) => (
          <div key={idx}>
            <Image
              src={slide}
              alt={`Slider Image ${idx + 1}`}
              className="w-full h-auto object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MainSlider;
