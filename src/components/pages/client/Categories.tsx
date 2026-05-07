import React from 'react'

import { categories } from './content'

const Categories = () => {
    return (
        <section className='border-b bg-white px-4 py-8'>
            <div className='container'>
                <div className='scrollbar-hide flex gap-2 overflow-x-auto pb-2'>
                    {categories.map((category, index) => (
                        <button
                            key={category}
                            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${index === 0
                                ? 'bg-[rgb(var(--color-primary-500))] text-white'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Categories
