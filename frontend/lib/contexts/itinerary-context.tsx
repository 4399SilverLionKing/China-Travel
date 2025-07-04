'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ItineraryPlanData } from '@/lib/types/itinerary';

interface ItineraryContextType {
  itineraryData: ItineraryPlanData | null;
  setItineraryData: (data: ItineraryPlanData | null) => void;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [itineraryData, setItineraryData] = useState<ItineraryPlanData | null>(null);

  return (
    <ItineraryContext.Provider value={{ itineraryData, setItineraryData }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItinerary must be used within an ItineraryProvider');
  }
  return context;
}
