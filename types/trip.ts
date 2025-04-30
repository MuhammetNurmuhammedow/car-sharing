import { User, UserRole } from "@/contexts/auth-context";

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Trip {
  id: string;
  driver: User;
  startLocation: Location;
  endLocation: Location;
  departureDate: Date;
  departureTime: string;
  availableSeats: number;
  passengers: User[];
  totalCost: number;
  costPerPerson: number;
  description?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

export type TripFormData = {
  startLocationName: string;
  startLocationLat: number;
  startLocationLng: number;
  endLocationName: string;
  endLocationLat: number;
  endLocationLng: number;
  departureDate: Date;
  departureTime: string;
  availableSeats: number;
  totalCost: number;
  description?: string;
};