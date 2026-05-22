import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { Button } from '@/components/ui/button'
import { Calendar, MessageCircle, ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const blogPosts = [
    {
        title: 'Conquer the Heights — Trekking Across Hunza Valley',
        author: 'tayyib',
        date: '01 Nov 2025',
        likes: 0,
        comments: 0,
        excerpt: 'Discover the thrill of trekking through the stunning trails of Hunza Valley.',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'The Living History of Baltistan — Traditions That Time Preserved',
        author: 'tayyib',
        date: '01 Nov 2025',
        likes: 0,
        comments: 0,
        excerpt: 'Experience the timeless culture and heritage of Baltistan with guided cultural tours.',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Taste of the North — Traditional Flavors of Gilgit-Baltistan',
        author: 'North Trips Team',
        date: '01 Nov 2025',
        likes: 0,
        comments: 0,
        excerpt: 'Savor the authentic flavors of Gilgit-Baltistan with our guided food tours.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    },
] as const

function BlogCard({
    title,
    author,
    date,
    likes,
    comments,
    excerpt,
    image,
}: (typeof blogPosts)[number]) {
    return (
        <article className='flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]'>
            <div className='relative aspect-[4/3] shrink-0 overflow-hidden border-b border-white/20 w-[416px] h-[250px]'>
                <Image src={image} alt={title} fill className='object-cover' sizes='(max-width: 768px) 100vw, 33vw' />
                <div className='absolute inset-x-0 bottom-0 flex items-stretch border-t border-white/25 bg-transparent'>
                    <div className='flex flex-1 items-center justify-center gap-1.5 border-r border-white/80 px-3 py-2.5 font-roboto text-sm font-normal leading-5 text-white'>
                        <Calendar className='h-3.5 w-3.5 shrink-0 stroke-[1.5]' aria-hidden />
                        {date}
                    </div>
                    <div className='flex flex-1 items-center justify-center gap-1.5 border-r border-white/80 px-3 py-2.5 font-roboto text-sm font-normal leading-5 text-white'>
                        <ThumbsUp className='h-3.5 w-3.5 shrink-0 stroke-[1.5]' aria-hidden />
                        {likes}
                    </div>
                    <div className='flex flex-1 items-center justify-center gap-1.5 px-3 py-2.5 font-roboto text-sm font-normal leading-5 text-white'>
                        <MessageCircle className='h-3.5 w-3.5 shrink-0 stroke-[1.5]' aria-hidden />
                        {comments}
                    </div>
                </div>
            </div>

            <div className='flex flex-1 flex-col p-6 w-[416px] h-[269px]'>
                <p className='font-roboto text-base font-normal leading-6 pb-3 text-[#6B7280]'>
                    Posted By: <span className='text-[#6B7280]'>{author}</span>
                </p>
                <h3 className='pt-2 font-roboto sm:text-2xl font-semibold text-[#111827] text-[17px] leading-7 pb-4'>
                    {title}
                </h3>
                <p className='pt-2 flex-1 font-roboto text-base font-normal leading-6 text-[#6B7280]'>
                    {excerpt}
                </p>
                <Button
                    asChild
                    variant='default'
                    className='mt-4 !inline-flex h-10 w-max min-w-[110px] md:max-w-[126px] md:h-[42px] justify-center rounded-full border-0 bg-[#276968] px-6 font-roboto text-sm font-normal leading-6 text-white shadow-none hover:bg-[#1f5453]'
                >
                    <Link href='#'>Read More</Link>
                </Button>
            </div>
        </article>
    )
}

const PopularTravelBlogs = () => {
    return (
        <section className='bg-white pb-16 sm:pb-20 lg:pb-[149px]' aria-labelledby='popular-travel-blogs-heading'>
            <div className='agency-container'>
                <header className='mx-auto max-w-[861px] text-center'>
                    <SectionEyebrow name='Our Blog' />
                    <h2
                        id='popular-travel-blogs-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] text-[#14141F] sm:pt-4'
                    >
                        Popular Travel Blogs
                    </h2>
                    <p className='mx-auto pt-4 font-roboto text-base font-normal leading-7 text-[#6B7280] sm:pt-5'>
                        Discover amazing travel stories, tips, and guides from our experienced travelers. Get
                        inspired for your next adventure with our latest blog posts.
                    </p>
                </header>

                <div className='mx-auto grid max-w-[1280px] grid-cols-1 gap-6 pt-10 sm:grid-cols-2 sm:gap-6 sm:pt-12 lg:grid-cols-3 lg:gap-6 lg:pt-14'>
                    {blogPosts.map((post) => (
                        <BlogCard key={post.title} {...post} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PopularTravelBlogs
