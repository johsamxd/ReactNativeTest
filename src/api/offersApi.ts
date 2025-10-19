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
    // Актуальная геолокация
    const response = await fetch(
      `https://mobile.handswork.pro/api/offers/map-list-unauthorized?latitude=${latitude}&longitude=${longitude}`,
    );
    console.log('latitude', latitude);
    console.log('longitude', longitude);
    console.log(
      `https://mobile.handswork.pro/api/offers/map-list-unauthorized?latitude=${latitude}&longitude=${longitude}`,
    );
    // Для тестовых данных
    // const response = await fetch(
    //   `https://mobile.handswork.pro/api/shifts/map-list-unauthorized?latitude=45.039268&longitude=38.987221`,
    // );

    const result = await response.json();

    return result.data || [];
  } catch (error) {
    console.error('Error in getOffers:', error);
    throw error;
  }
};
