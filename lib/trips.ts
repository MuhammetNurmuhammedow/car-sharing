"use client";

import { Trip, TripFormData } from "@/types/trip";
import { User } from "@/contexts/auth-context";

// In a real app, this would interact with a backend API
// For demo purposes, we'll use localStorage

// Get all trips
export const getAllTrips = (): Trip[] => {
  try {
    const tripsJSON = localStorage.getItem("trips");
    if (!tripsJSON) return [];

    const trips = JSON.parse(tripsJSON);
    return trips.map((trip: any) => ({
      ...trip,
      departureDate: new Date(trip.departureDate),
      createdAt: new Date(trip.createdAt),
    }));
  } catch (error) {
    console.error("Error getting trips:", error);
    return [];
  }
};

// Get trips by driver
export const getTripsByDriver = (driverId: string): Trip[] => {
  const trips = getAllTrips();
  return trips.filter((trip) => trip.driver.id === driverId);
};

// Get trips by passenger
export const getTripsByPassenger = (passengerId: string): Trip[] => {
  const trips = getAllTrips();
  return trips.filter((trip) => 
    trip.passengers.some((passenger) => passenger.id === passengerId)
  );
};

// Get trip by ID
export const getTripById = (tripId: string): Trip | null => {
  const trips = getAllTrips();
  const trip = trips.find((trip) => trip.id === tripId);
  return trip || null;
};

// Create a new trip
export const createTrip = (tripData: TripFormData, driver: User): Trip => {
  const trips = getAllTrips();
  
  const newTrip: Trip = {
    id: `trip_${Date.now()}`,
    driver,
    startLocation: {
      id: `loc_start_${Date.now()}`,
      name: tripData.startLocationName,
      lat: tripData.startLocationLat,
      lng: tripData.startLocationLng,
    },
    endLocation: {
      id: `loc_end_${Date.now()}`,
      name: tripData.endLocationName,
      lat: tripData.endLocationLat,
      lng: tripData.endLocationLng,
    },
    departureDate: tripData.departureDate,
    departureTime: tripData.departureTime,
    availableSeats: tripData.availableSeats,
    passengers: [],
    totalCost: tripData.totalCost,
    costPerPerson: tripData.totalCost / (tripData.availableSeats + 1), // driver + passengers
    description: tripData.description,
    status: 'scheduled',
    createdAt: new Date(),
  };
  
  trips.push(newTrip);
  localStorage.setItem("trips", JSON.stringify(trips));
  
  return newTrip;
};

// Update a trip
export const updateTrip = (tripId: string, updatedData: Partial<Trip>): Trip | null => {
  const trips = getAllTrips();
  const tripIndex = trips.findIndex((trip) => trip.id === tripId);
  
  if (tripIndex === -1) {
    return null;
  }
  
  const updatedTrip = {
    ...trips[tripIndex],
    ...updatedData,
    // Recalculate cost per person if needed
    costPerPerson: updatedData.totalCost 
      ? updatedData.totalCost / (trips[tripIndex].availableSeats + 1)
      : trips[tripIndex].costPerPerson,
  };
  
  trips[tripIndex] = updatedTrip;
  localStorage.setItem("trips", JSON.stringify(trips));
  
  return updatedTrip;
};

// Join a trip as a passenger
export const joinTrip = (tripId: string, passenger: User): Trip | null => {
  const trips = getAllTrips();
  const tripIndex = trips.findIndex((trip) => trip.id === tripId);
  
  if (tripIndex === -1) {
    return null;
  }
  
  const trip = trips[tripIndex];
  
  // Check if there are available seats
  if (trip.availableSeats <= trip.passengers.length) {
    throw new Error("No available seats");
  }
  
  // Check if passenger is already in the trip
  if (trip.passengers.some((p) => p.id === passenger.id)) {
    throw new Error("Already joined this trip");
  }
  
  // Add passenger to trip
  trip.passengers.push(passenger);
  
  // Recalculate cost per person
  trip.costPerPerson = trip.totalCost / (trip.passengers.length + 1); // +1 for driver
  
  localStorage.setItem("trips", JSON.stringify(trips));
  
  return trip;
};

// Leave a trip as a passenger
export const leaveTrip = (tripId: string, passengerId: string): Trip | null => {
  const trips = getAllTrips();
  const tripIndex = trips.findIndex((trip) => trip.id === tripId);
  
  if (tripIndex === -1) {
    return null;
  }
  
  const trip = trips[tripIndex];
  
  // Remove passenger from trip
  trip.passengers = trip.passengers.filter((p) => p.id !== passengerId);
  
  // Recalculate cost per person if there are still passengers
  if (trip.passengers.length > 0) {
    trip.costPerPerson = trip.totalCost / (trip.passengers.length + 1); // +1 for driver
  } else {
    trip.costPerPerson = trip.totalCost;
  }
  
  localStorage.setItem("trips", JSON.stringify(trips));
  
  return trip;
};

// Cancel a trip
export const cancelTrip = (tripId: string): boolean => {
  const trips = getAllTrips();
  const tripIndex = trips.findIndex((trip) => trip.id === tripId);
  
  if (tripIndex === -1) {
    return false;
  }
  
  trips[tripIndex].status = 'cancelled';
  localStorage.setItem("trips", JSON.stringify(trips));
  
  return true;
};

// Search for trips
export const searchTrips = (
  startLocationName: string,
  endLocationName: string,
  departureDate?: Date
): Trip[] => {
  const trips = getAllTrips();
  
  return trips.filter((trip) => {
    // Filter by location names (case insensitive partial match)
    const startMatches = trip.startLocation.name
      .toLowerCase()
      .includes(startLocationName.toLowerCase());
    
    const endMatches = trip.endLocation.name
      .toLowerCase()
      .includes(endLocationName.toLowerCase());
    
    // Filter by date if provided
    const dateMatches = !departureDate || 
      trip.departureDate.toDateString() === departureDate.toDateString();
    
    // Only return active or scheduled trips
    const statusValid = trip.status === 'scheduled' || trip.status === 'active';
    
    // Only return trips with available seats
    const hasSeats = trip.availableSeats > trip.passengers.length;
    
    return startMatches && endMatches && dateMatches && statusValid && hasSeats;
  });
};

// Initialize with some dummy data
export const initializeDummyData = (currentUser: User) => {
  if (localStorage.getItem("trips")) {
    return; // Data already exists
  }

  const dummyDriver: User = {
    id: "driver_1",
    firstName: "Jane",
    lastName: "Smith",
    username: "jsmith",
    role: "driver"
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const dummyTrips: Trip[] = [
    {
      id: "trip_1",
      driver: dummyDriver,
      startLocation: {
        id: "loc_1",
        name: "New York",
        lat: 40.7128,
        lng: -74.0060
      },
      endLocation: {
        id: "loc_2",
        name: "Boston",
        lat: 42.3601,
        lng: -71.0589
      },
      departureDate: tomorrow,
      departureTime: "09:00",
      availableSeats: 3,
      passengers: [],
      totalCost: 120,
      costPerPerson: 30,
      description: "Direct route via I-95. Will stop once for a quick break.",
      status: "scheduled",
      createdAt: today
    },
    {
      id: "trip_2",
      driver: currentUser.role === "driver" ? currentUser : dummyDriver,
      startLocation: {
        id: "loc_3",
        name: "Chicago",
        lat: 41.8781,
        lng: -87.6298
      },
      endLocation: {
        id: "loc_4",
        name: "Detroit",
        lat: 42.3314,
        lng: -83.0458
      },
      departureDate: tomorrow,
      departureTime: "14:00",
      availableSeats: 4,
      passengers: [],
      totalCost: 80,
      costPerPerson: 20,
      description: "Taking I-94 E. Comfortable SUV with good music.",
      status: "scheduled",
      createdAt: today
    },
    {
      id: "trip_3",
      driver: dummyDriver,
      startLocation: {
        id: "loc_5",
        name: "San Francisco",
        lat: 37.7749,
        lng: -122.4194
      },
      endLocation: {
        id: "loc_6",
        name: "Los Angeles",
        lat: 34.0522,
        lng: -118.2437
      },
      departureDate: nextWeek,
      departureTime: "10:30",
      availableSeats: 2,
      passengers: [
        {
          id: currentUser.role === "passenger" ? currentUser.id : "passenger_1",
          firstName: currentUser.role === "passenger" ? currentUser.firstName : "Alex",
          lastName: currentUser.role === "passenger" ? currentUser.lastName : "Johnson",
          username: currentUser.role === "passenger" ? currentUser.username : "ajohnson",
          role: "passenger"
        }
      ],
      totalCost: 150,
      costPerPerson: 50,
      description: "Scenic coastal drive on Highway 1. Will make stops at nice viewpoints.",
      status: "scheduled",
      createdAt: today
    }
  ];

  localStorage.setItem("trips", JSON.stringify(dummyTrips));
};

// Calculate distances between two points (in km)
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};