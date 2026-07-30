import React from 'react'

const TwoLineMenu = () => {
    return (
        <span className="flex w-5 flex-col items-end gap-[5px]" aria-hidden>
            <span className="h-[2px] w-5 rounded-full bg-current" />
            <span className="h-[2px] w-3 rounded-full bg-current" />
        </span>
    )
}

export default TwoLineMenu