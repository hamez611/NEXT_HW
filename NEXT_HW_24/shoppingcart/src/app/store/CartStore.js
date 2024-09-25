'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set) => ({
            cart: [],
            setCart: (newCart) => set({ cart: newCart }),
        }),
        {
            name: 'cart-storage', // 로컬 스토리지에 저장될 키 이름
        }
    )
);
