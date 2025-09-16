import { listCategories } from "@lib/data/categories"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function NavbarCategories() {
  const productCategories = await listCategories()

  // Filter only parent categories for main navigation
  const parentCategories = productCategories?.filter(
    (category) => !category.parent_category
  ) || []

  // Separate Drop categories from regular categories
  const dropCategories = parentCategories.filter(category => 
    category.name.toLowerCase().includes('drop')
  )
  
  const regularCategories = parentCategories.filter(category => 
    !category.name.toLowerCase().includes('drop')
  )

  return (
    <nav className="hidden medium:flex items-center gap-x-8 h-full">
      {/* Inicio - Hardcoded */}
      <LocalizedClientLink
        href="/"
        className="txt-compact-plus hover:text-ui-fg-base transition-colors duration-200"
      >
        Inicio
      </LocalizedClientLink>

      {/* Regular Dynamic Categories from Medusa */}
      {regularCategories.length > 0 && 
        regularCategories.map((category) => {
          const children = category.category_children?.map((child) => ({
            name: child.name,
            handle: child.handle,
            id: child.id,
          })) || []

          // If category has children, render as dropdown
          if (children.length > 0) {
            return (
              <DropdownMenu.Root key={category.id}>
                <DropdownMenu.Trigger asChild>
                  <button className="txt-compact-plus hover:text-ui-fg-base transition-colors duration-200 flex items-center gap-1 outline-none">
                    {category.name}
                    <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[220px] bg-white rounded-md p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50 border border-ui-border-base"
                    sideOffset={5}
                  >
                    {/* Parent category link */}
                    <DropdownMenu.Item asChild>
                      <LocalizedClientLink
                        href={`/categories/${category.handle}`}
                        className="txt-small text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle rounded px-2 py-2 block transition-colors duration-200 outline-none cursor-pointer font-medium border-b border-ui-border-base mb-2"
                      >
                        Ver todo {category.name}
                      </LocalizedClientLink>
                    </DropdownMenu.Item>

                    {/* Subcategories */}
                    {children.map((child, index) => (
                      <DropdownMenu.Item key={child.id} asChild>
                        <LocalizedClientLink
                          href={`/categories/${child.handle}`}
                          className="txt-small text-ui-fg-muted hover:text-ui-fg-base hover:bg-ui-bg-subtle rounded px-2 py-1 block transition-colors duration-200 outline-none cursor-pointer"
                        >
                          {child.name}
                        </LocalizedClientLink>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )
          } else {
            // If no children, render as simple link
            return (
              <LocalizedClientLink
                key={category.id}
                href={`/categories/${category.handle}`}
                className="txt-compact-plus hover:text-ui-fg-base transition-colors duration-200"
              >
                {category.name}
              </LocalizedClientLink>
            )
          }
        })
      }

      {/* Drops Dropdown - Groups all Drop categories */}
      {dropCategories.length > 0 && (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="txt-compact-plus hover:text-ui-fg-base transition-colors duration-200 flex items-center gap-1 outline-none">
              Drops
              <span className="text-sm">🔥</span>
              <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] bg-white rounded-md p-2 shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50 border border-ui-border-base"
              sideOffset={5}
            >
              {dropCategories.map((dropCategory, index) => {
                const children = dropCategory.category_children?.map((child) => ({
                  name: child.name,
                  handle: child.handle,
                  id: child.id,
                })) || []

                return (
                  <div key={dropCategory.id}>
                    {/* Drop category link */}
                    <DropdownMenu.Item asChild>
                      <LocalizedClientLink
                        href={`/categories/${dropCategory.handle}`}
                        className="txt-small text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle rounded px-2 py-2 block transition-colors duration-200 outline-none cursor-pointer font-medium"
                      >
                        {dropCategory.name}
                      </LocalizedClientLink>
                    </DropdownMenu.Item>

                    {/* Drop subcategories if any */}
                    {children.length > 0 && (
                      <div className="ml-4 border-l border-ui-border-base pl-2 mt-1 mb-2">
                        {children.map((child) => (
                          <DropdownMenu.Item key={child.id} asChild>
                            <LocalizedClientLink
                              href={`/categories/${child.handle}`}
                              className="txt-small text-ui-fg-muted hover:text-ui-fg-base hover:bg-ui-bg-subtle rounded px-2 py-1 block transition-colors duration-200 outline-none cursor-pointer"
                            >
                              {child.name}
                            </LocalizedClientLink>
                          </DropdownMenu.Item>
                        ))}
                      </div>
                    )}
                    
                    {/* Separator between different drop categories */}
                    {index < dropCategories.length - 1 && (
                      <DropdownMenu.Separator className="h-px bg-ui-border-base my-1" />
                    )}
                  </div>
                )
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      )}

      {/* Show loading if no categories at all */}
      {parentCategories.length === 0 && (
        <span className="txt-compact-plus text-ui-fg-muted">
          Cargando categorías...
        </span>
      )}

      {/* Sobre Nosotros - Hardcoded */}
      <LocalizedClientLink
        href="/sobre-nosotros"
        className="txt-compact-plus hover:text-ui-fg-base transition-colors duration-200"
      >
        Sobre Nosotros
      </LocalizedClientLink>
    </nav>
  )
}

// Loading component for Suspense
export function NavbarCategoriesSkeleton() {
  return (
    <nav className="hidden medium:flex items-center gap-x-8 h-full">
      <div className="h-4 w-12 bg-ui-bg-subtle rounded animate-pulse"></div>
      <div className="h-4 w-16 bg-ui-bg-subtle rounded animate-pulse"></div>
      <div className="h-4 w-10 bg-ui-bg-subtle rounded animate-pulse"></div>
      <div className="h-4 w-20 bg-ui-bg-subtle rounded animate-pulse"></div>
      <div className="h-4 w-12 bg-ui-bg-subtle rounded animate-pulse"></div>
      <div className="h-4 w-24 bg-ui-bg-subtle rounded animate-pulse"></div>
    </nav>
  )
}
