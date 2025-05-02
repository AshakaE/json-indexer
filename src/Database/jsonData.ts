export interface LargeTypeJSON {
  id: string;
  city: string;
  availability: boolean;
  priceSegment: string;
  pricePerNight: number;
}

export interface StructuredTypeJSON {
  id: number;
  name: string;
  address: {
    country: string;
    city: string;
  };
  isAvailable: boolean;
  priceForNight: number;
}
