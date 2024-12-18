'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Category } from '@/lib/StoreTypes'
interface NavigationProps {
  categoriesData: Category[]
}

const Navigation: React.FC<NavigationProps> = ({ categoriesData }) => {

  const pathname = usePathname()

  const CategoriesRoutes = categoriesData?.map((category) => ({
    href: `/category/${category.id}`,
    name:category.name,
    active: pathname === `/category/${category.id}`,
  }))

  const dashboard = {
    // change for vercel
    href: `${process.env.NEXT_PUBLIC_DASHBOARD_URL}`,
    name: 'Dashboard',
    active: false,
  }
  CategoriesRoutes?.push(dashboard)

  return (
    <nav className={'mx-4 items-center space-x-2 sm:flex hidden lg:space-x-4'}>
      {CategoriesRoutes?.map((category) => (
        <Link
          className={cn(
            'relative group capitalize text-md transition-colors text-secondary-foreground  hover:primary-foreground',
            category.active && 'text-primary font-bold ' ,
          )}
          href={`${category.href}`}
          key={category.href}
        >
          {category.name}
          <span
            className={cn(
              'absolute left-0 bottom-[-2px] w-full h-[2px] bg-primary rounded-md  transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100',
              category.active ? 'scale-x-100' : 'scale-x-0'
            )}
          />
        </Link>
      ))}
    </nav>
  )
}

export default Navigation
