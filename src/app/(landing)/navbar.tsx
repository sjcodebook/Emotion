import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const menu: {
  triggerName: string
  href?: string
  content?: { title: string; href: string; description?: string }[]
}[] = [
  {
    triggerName: 'Product',
    content: [
      {
        title: 'AI',
        href: '#',
        description: 'Integrate AI assistant',
      },
      {
        title: 'Docs',
        href: '#',
        description: 'Simple and powerful',
      },
      {
        title: 'Wikis',
        href: '#',
        description: 'Centralize your knowledge',
      },
      {
        title: 'Projects',
        href: '#',
        description: 'For every team or size',
      },
      {
        title: 'Calendar',
        href: '#',
        description: 'Time and work, Together',
      },
    ],
  },
  {
    triggerName: 'Teams',
    content: [
      {
        title: 'Product',
        href: '#',
      },
      {
        title: 'Engineering',
        href: '#',
      },
      {
        title: 'Design',
        href: '#',
      },
      {
        title: 'Marketing',
        href: '#',
      },
      {
        title: 'IT',
        href: '#',
      },
    ],
  },
  {
    triggerName: 'Download',
    content: [
      {
        title: 'Notion',
        href: '#',
      },
      {
        title: 'Calendar',
        href: '#',
      },
      {
        title: 'Web Clipper',
        href: '#',
      },
    ],
  },
  {
    triggerName: 'Pricing',
    href: '#',
  },
]

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}>
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'

const Navbar = () => {
  return (
    <div className='h-[60px] py-4 px-4 flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <Image src='assets/svg/logo.svg' alt='logo' width={91} height={26} />
        <div className='flex items-center space-x-2'>
          <NavigationMenu>
            <NavigationMenuList>
              {menu.map((item) => (
                <div key={item.triggerName}>
                  {item.content ? (
                    <NavigationMenuItem key={item.triggerName}>
                      <NavigationMenuTrigger className='cursor-pointer'>
                        {item.triggerName}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                          {item.content?.map((content) => (
                            <ListItem key={content.title} title={content.title} href={content.href}>
                              {content.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.triggerName}>
                      <Link href={item.href ?? ''} legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          {item.triggerName}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  )}
                </div>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className='flex items-center space-x-3'>
        <ModeToggle />
        <div className='w-[1px] h-5 bg-gray-200 mx-4' />
        <Button variant='ghost'>Log in</Button>
        <Button>Sign up</Button>
      </div>
    </div>
  )
}

export default Navbar
