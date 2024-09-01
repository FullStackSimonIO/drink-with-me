"use sever";

import { prisma } from "../lib/prisma";

export async function addBeer = () => {
    try {
        const updateCount = await prisma.fridge.update({
            
        })
    } catch (error) {
        
    }
}