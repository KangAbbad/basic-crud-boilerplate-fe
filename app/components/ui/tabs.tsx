import { createContext, forwardRef, useContext, type ButtonHTMLAttributes, type HTMLAttributes } from 'react'

import { cn } from '~/lib/utils/cn'

type TabsContextType = {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

type TabsProps = HTMLAttributes<HTMLDivElement> & {
  value: string
  onValueChange: (value: string) => void
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ value, onValueChange, className, children, ...props }, ref) => (
    <TabsContext.Provider value={{ activeTab: value, onTabChange: onValueChange }}>
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
)
Tabs.displayName = 'Tabs'

type TabsListProps = HTMLAttributes<HTMLDivElement>

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full',
      className
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, onClick, ...props }, ref) => {
    const { activeTab, onTabChange } = useTabsContext()
    const isActive = activeTab === value

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onTabChange(value)
          onClick?.(e)
        }}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed',
          isActive
            ? 'bg-background text-foreground shadow-sm border-b-2 border-info'
            : 'text-muted-foreground hover:text-foreground',
          className
        )}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

type TabsContentProps = HTMLAttributes<HTMLDivElement> & {
  value: string
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(({ className, value, ...props }, ref) => {
  const { activeTab } = useTabsContext()

  if (activeTab !== value) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  )
})
TabsContent.displayName = 'TabsContent'
