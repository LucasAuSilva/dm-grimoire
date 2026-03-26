"use client"

import React, { useContext, useState, type ReactNode } from "react"

type PageContextProps = {
  children: ReactNode
};

const PageContext = React.createContext<{
  page: Pages,
  changePage: (value: Pages) => void
} | undefined>(undefined)

export type Pages = 'converter' | 'combat'

export function PageProvider({ children }: PageContextProps) {
  const [page, setPage] = useState<Pages>('converter')

  function changePage(value: Pages) {
    setPage(value)
  }

  const contextValue = {
    page,
    changePage
  }

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
}

export const usePageContext = () => {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error('PageContexzt must be used within a PageProvider')
  }
  return context
}


