export interface Offer {
  address: string;
  bonusPriceWorker: number;
  companyName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  currentWorkers: number;
  customerFeedbacksCount: string;
  customerRating: number | null;
  dateStartByCity: string; //date only
  id: string;
  isPromotionEnabled: boolean;
  logo: string;
  planWorkers: number;
  priceWorker: number;
  timeEndByCity: string; //time only
  timeStartByCity: string; //time only
  workTypes: WorkType[];
}

export interface WorkType {
  id: number;
  name: string;
  nameGt5: string;
  nameLt5: string;
  nameOne: string;
}

export const getOffers = async (
  latitude: number,
  longitude: number,
): Promise<Offer[]> => {
  try {
    const response = await fetch(
      `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=${latitude}&longitude=${longitude}`,
    );

    const result = await response.json();

    return result.data || [];
  } catch (error) {
    console.error('Error in getOffers:', error);
    throw error;
  }
};
