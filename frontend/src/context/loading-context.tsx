"use client"

import React, { useContext, useState, type ReactNode } from "react"

type LoadingContextProps = {
  children: ReactNode
};

const LoadingContext = React.createContext<{
  isLoading: boolean,
  updateLoading: (value: boolean) => void
} | undefined>(undefined)

export function LoadingProvider({ children }: LoadingContextProps) {
  const [isLoading, setIsLoading] = useState(false)

  function updateLoading(value: boolean) {
    setIsLoading(value)
  }

  const contextValue = {
    isLoading,
    updateLoading
  }

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoadingContext = () => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('LoadingContext must be used within a LoadingProvider')
  }
  return context
}


