'use client'
import React from 'react'
import Image from 'next/image'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Input } from '../ui/input'
import Link from 'next/link'
import { AiOutlineSearch, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import ProfileMenuItem from './ProfileMenuItem'


const Navbar = () => {

  const categories_data = [
    {
      title: "Alert Dialog",
      href: "/docs/primitives/alert-dialog",
    },
    {
      title: "Hover Card",
      href: "/docs/primitives/hover-card",
    },
    {
      title: "Progress",
      href: "/docs/primitives/progress",
    },
    {
      title: "Scroll-area",
      href: "/docs/primitives/scroll-area",
    },
    {
      title: "Tabs",
      href: "/docs/primitives/tabs",
    },
    {
      title: "Tooltip",
      href: "/docs/primitives/tooltip",
    },
  ]
  return (
    <>
      <NavigationMenu className='px-10 py-4 max-w-full border-b'>
        <div className='w-full'>
          <NavigationMenuList className='space-x-0 gap-4  justify-start'>
            {/* Brand Name */}
            <NavigationMenuItem>
              <Image
                src='/Assets/Techgrid.svg'
                alt='TechGrid Logo'
                width={"40"}
                height={"40"}
                loading='lazy'
              ></Image>
            </NavigationMenuItem>

            {/* Categories */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className='text-black font-normal data-[state=open]:text-indigo-500 text-sm'>
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex flex-col gap-3 p-4 w-[300px]">
                  {categories_data.map((component) => (
                    <li key={component.title} className='hover:text-indigo-500 text-xs font-normal'>
                      <Link href={component.href}>{component.title}</Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {/* Search field */}
            <NavigationMenuItem className='w-full'>
              <div className='w-full border border-black rounded-full px-4 overflow-hidden flex items-center gap-4'>
                <span className='text-muted-foreground text-lg'><AiOutlineSearch /></span>
                <Input
                  type="text"
                  placeholder="Search for anything"
                  className='w-full bg-transparent focus-visible:ring-0 focus:outline-none border-none placeholder:text-xs placeholder:font-normal p-0' />
              </div>
            </NavigationMenuItem>
            {/* My learning */}
            <NavigationMenuItem className='text-black font-normal hover:text-indigo-500 text-sm min-w-fit'>
              <Link href={'/'}>My learning</Link>
            </NavigationMenuItem>

            {/* Wishlist */}
            <NavigationMenuItem className='text-black font-normal hover:text-indigo-500 text-sm'>
              <Link href={'/'}>
                <span className='text-2xl'><AiOutlineHeart /></span>
              </Link>
            </NavigationMenuItem>

            {/* Cart */}
            <NavigationMenuItem className='text-black font-normal hover:text-indigo-500 text-sm'>
              <Link href={'/'}>
                <span className='text-2xl'><AiOutlineShoppingCart /></span>
              </Link>
            </NavigationMenuItem>

            {/* Profile */}

            <ProfileMenuItem/>
          

          </NavigationMenuList>
        </div>


      </NavigationMenu>
    </>
  )
}

export default Navbar