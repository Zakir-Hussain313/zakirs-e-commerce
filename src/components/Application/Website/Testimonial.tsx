'use client';

import React from 'react';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoStar } from 'react-icons/io5';
import { BsChatQuote } from 'react-icons/bs';


interface Testimonial {
    name: string;
    review: string;
    rating: number;
}


const testimonials: Testimonial[] = [
    {
        name: "Ali Raza",
        review: `I had a wonderful experience shopping here. The website was smooth, 
    the checkout process was simple, and delivery was right on time. 
    The product quality exceeded my expectations and I’ll definitely order again.`,
        rating: 5,
    },
    {
        name: "Sara Khan",
        review: `The prices are really competitive compared to other online stores. 
    Customer support was also very responsive and helpful. 
    I appreciate the transparency and the overall professionalism.`,
        rating: 4,
    },
    {
        name: "Bilal Ahmed",
        review: `I bought a chair for my office setup and I’m very happy with it. 
    The build quality is solid, and the design matches perfectly with my workspace. 
    Delivery was quick and the packaging was secure.`,
        rating: 5,
    },
    {
        name: "Fatima Noor",
        review: `At first I was hesitant to order online, but this store changed my mind. 
    The website is easy to navigate, and I got exactly what I ordered. 
    Highly recommend it to anyone looking for reliable service.`,
        rating: 5,
    },
    {
        name: "Zubair Malik",
        review: `The product was good overall, but the delivery took one extra day. 
    That said, the packaging was neat and everything was intact. 
    I would still buy again because the quality was worth it.`,
        rating: 4,
    },
    {
        name: "Nida Javed",
        review: `I purchased a few home items and I’m very satisfied with my experience. 
    The descriptions on the website were accurate and the products matched perfectly. 
    I will surely recommend this to my friends and family.`,
        rating: 5,
    },
    {
        name: "Usman Shah",
        review: `The customer service team was very patient and answered all my queries. 
    I felt confident about my purchase because of their support. 
    Overall, a smooth and trustworthy experience.`,
        rating: 5,
    },
    {
        name: "Hira Ansari",
        review: `The website is clean and easy to use which made browsing products fun. 
    The payment gateway felt secure and everything went smoothly. 
    The product quality is top-notch and I’ll definitely order again.`,
        rating: 5,
    },
    {
        name: "Hamza Ali",
        review: `I had an issue with one of my items but the team resolved it quickly. 
    Their after-sales service really impressed me, which is rare to see these days. 
    Because of this, I’ll remain a loyal customer.`,
        rating: 4,
    },
    {
        name: "Sana Iqbal",
        review: `I absolutely loved the variety of products available here. 
    It was easy to filter and find exactly what I needed. 
    The delivery was fast and the items were carefully packed.`,
        rating: 5,
    },
];




const Testimonial = () => {

    const settings = {
        autoplay: true,
        autoplaySpeed: 2000,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    infinite: true
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                },
            }
        ],
    };

    return (
        <div className='lg:px-32 px-4 sm:pt-2 pt-5 pb-10 mt-5'>
            <h2 className='text-center sm:text-4xl text-2xl mb-5'>Customer Rerviews</h2>
            <Slider {...settings}>
                {
                    testimonials.map((item, index) => (
                        <div key={index} className='p-5'>
                            <div className='border rounded-lg p-5'>
                                <BsChatQuote size={30} className='mb-3'/>
                            <p className='mb-5'>{item.review}</p>
                            <h4 className='font-semibold '>{item.name}</h4>
                            <div className='flex mt-1'>
                                {Array.from({ length: item.rating }).map((_, i) => (
                                    <IoStar key={`star${i}`} className='text-yellow-400' size={20} />
                                ))}
                            </div>
                            </div>
                        </div>
                    ))
                }
            </Slider>
        </div>
    );
}

export default Testimonial
