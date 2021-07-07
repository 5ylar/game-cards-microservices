import React from "react"
import { useCookie } from "next-cookie"
import { useRouter } from "next/router"
import axios from "axios"
import { NSGameMatchingCards } from "../ns"

export const withAuth = (component: (props?: any) => JSX.Element) => (props?: any) => {
    const isServer = typeof window === "undefined"
    
    // client side
    if (!isServer) {
        const cookie = useCookie()
        const userId = <string | undefined>cookie.get("userId")
        
        // set user id on client side
        NSGameMatchingCards.setUserId(userId)

        if (!userId) {
            const router = useRouter()
            router.replace("/login")
            return React.Fragment
        }

    }

    return component(props)
}
