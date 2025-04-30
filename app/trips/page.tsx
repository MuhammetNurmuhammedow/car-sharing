"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Trip } from "@/types/trip";
import { 
  getAllTrips, 
  searchTrips, 
  initializeDummyData,
  joinTrip 
} from "@/lib/trips";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Car, MapPin, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TripsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: undefined as Date | undefined,
  });
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize dummy data if user is logged in
    if (user) {
      initializeDummyData(user);
    }
    
    // Get all trips
    const allTrips = getAllTrips();
    setTrips(allTrips);
    setFilteredTrips(allTrips);
    setIsLoading(false);
  }, [user]);

  const handleSearch = () => {
    const results = searchTrips(
      searchParams.from,
      searchParams.to,
      searchParams.date
    );
    setFilteredTrips(results);
  };

  const handleJoinTrip = (tripId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to join trips.",
        variant: "destructive",
      });
      return;
    }
    
    if (user.role === "driver") {
      toast({
        title: "Action not allowed",
        description: "Drivers cannot join trips. Switch to passenger role to join trips.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const updatedTrip = joinTrip(tripId, user);
      
      if (updatedTrip) {
        // Update trips list
        setTrips((prevTrips) => 
          prevTrips.map((trip) => 
            trip.id === tripId ? updatedTrip : trip
          )
        );
        
        setFilteredTrips((prevTrips) => 
          prevTrips.map((trip) => 
            trip.id === tripId ? updatedTrip : trip
          )
        );
        
        toast({
          title: "Success!",
          description: "You've joined the trip.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to join trip",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const isUserInTrip = (trip: Trip) => {
    if (!user) return false;
    return trip.passengers.some((p) => p.id === user.id);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Syýahat Tapmak</h1>
            <p className="text-muted-foreground">
            Elýeterli syýahatlary gözläň we beýleki syýahatçylara goşulyň.
            </p>
          </div>
          
          {user?.role === "driver" && (
            <Button asChild>
              <Link href="/trips/create">
                <Car className="mr-2 h-4 w-4" />
                Syýahat Döret
              </Link>
            </Button>
          )}
        </div>
        
        {/* Search Form */}
        <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">Nireden</Label>
              <Input
                id="from"
                placeholder="Departure city"
                value={searchParams.from}
                onChange={(e) => 
                  setSearchParams((prev) => ({ ...prev, from: e.target.value }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to">Nirä</Label>
              <Input
                id="to"
                placeholder="Destination city"
                value={searchParams.to}
                onChange={(e) => 
                  setSearchParams((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Wagty</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !searchParams.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchParams.date ? (
                      format(searchParams.date, "PPP")
                    ) : (
                      <span>Bir senä saýlaň</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={searchParams.date}
                    onSelect={(date) => 
                      setSearchParams((prev) => ({ ...prev, date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2 flex items-end">
              <Button className="w-full" onClick={handleSearch}>
                Gözleg
              </Button>
            </div>
          </div>
        </div>
        
        {/* Results */}
        <h2 className="text-xl font-semibold mb-4">Elýeterli Syýahatlar</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p> Syýahatlar ýüklenýär...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="bg-muted p-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Syýahat tapylmady</h3>
            <p className="text-muted-foreground">
            Gözleg talaplaryňyzy üýtgetmegi ýa-da soňra gaýtadan barlamagy synanyşyň.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {format(new Date(trip.departureDate), "MMM d, yyyy")}
                        </p>
                        <h3 className="text-lg font-semibold">
                          {trip.startLocation.name} to {trip.endLocation.name}
                        </h3>
                      </div>
                      <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary">
                        <Car className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Nireden</p>
                          <p className="text-muted-foreground text-sm">{trip.startLocation.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Nirä</p>
                          <p className="text-muted-foreground text-sm">{trip.endLocation.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Ugur</p>
                          <p className="text-muted-foreground text-sm">
                            {format(new Date(trip.departureDate), "MMMM d, yyyy")} at {trip.departureTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Users className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Elýeterli Otuşyçlar</p>
                          <p className="text-muted-foreground text-sm">
                            {trip.availableSeats - trip.passengers.length} of {trip.availableSeats}
                          </p>
                        </div>
                      </div>
                      
                      {trip.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {trip.description.length > 100
                            ? `${trip.description.substring(0, 100)}...`
                            : trip.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 bg-muted/30 border-t flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">${trip.costPerPerson.toFixed(2)}</span>
                        <span className="text-muted-foreground"> Her bir adam üçin</span>
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/trips/${trip.id}`}>Maglumatlar</Link>
                      </Button>
                      
                      {!isUserInTrip(trip) ? (
                        <Button onClick={() => handleJoinTrip(trip.id)}>
                          Goşul
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          Goşulyndy
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}