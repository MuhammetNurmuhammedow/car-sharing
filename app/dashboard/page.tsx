"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trip } from "@/types/trip";
import { getTripsByDriver, getTripsByPassenger, initializeDummyData } from "@/lib/trips";
import { format } from "date-fns";
import { Car, MapPin, CalendarClock, Users } from "lucide-react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      router.push("/login");
    }
    
    // Initialize dummy data for demo
    if (user) {
      initializeDummyData(user);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Ýüklenýär...</p>
        </div>
      </div>
    );
  }

  // Get user trips based on role
  const trips: Trip[] = user.role === "driver" 
    ? getTripsByDriver(user.id)
    : getTripsByPassenger(user.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paneller</h1>
            <p className="text-muted-foreground">
              Hoş geldiňiz, {user.firstName}! Özüňizinkini dolandyryň {user.role === "driver" ? "trips" : "rides"}.
            </p>
          </div>
          
          {user.role === "driver" ? (
            <Button asChild>
              <Link href="/trips/create">
                <Car className="mr-2 h-4 w-4" />
                Syýahat Döretmek
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/trips">
                <Car className="mr-2 h-4 w-4" />
                Syýahat Gözlemek
              </Link>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {user.role === "driver" ? "My Trips" : "My Rides"}
              </CardTitle>
              <CardDescription>
                {user.role === "driver" ? "Total trips created" : "Total rides joined"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trips.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Geljekdäki</CardTitle>
              <CardDescription>
               Indiki 7 gün
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trips.filter(trip => {
                  const tripDate = new Date(trip.departureDate);
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  return tripDate <= nextWeek && tripDate >= new Date();
                }).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {user.role === "driver" ? "Passengers" : "Saved"}
              </CardTitle>
              <CardDescription>
                {user.role === "driver" ? "Total passengers" : "Money saved"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.role === "driver" 
                  ? trips.reduce((total, trip) => total + trip.passengers.length, 0)
                  : `$${trips.reduce((total, trip) => total + trip.costPerPerson, 0).toFixed(2)}`
                }
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-semibold mb-4">
          {user.role === "driver" ? "My Trips" : "My Rides"}
        </h2>
        
        {trips.length === 0 ? (
          <div className="bg-muted p-8 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-2">Syýahat tapylmady</h3>
            <p className="text-muted-foreground mb-4">
              {user.role === "driver"
                ? "You haven't created any trips yet."
                : "You haven't joined any rides yet."}
            </p>
            <Button asChild>
              <Link href={user.role === "driver" ? "/trips/create" : "/trips"}>
                {user.role === "driver" ? "Create Your First Trip" : "Find a Ride"}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`} className="group">
                <Card className="h-full transition-all group-hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {format(new Date(trip.departureDate), "MMM d, yyyy")}
                        </p>
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
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
                          <p className="text-sm font-medium">Nirden</p>
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
                        <CalendarClock className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Wagty</p>
                          <p className="text-muted-foreground text-sm">
                            {format(new Date(trip.departureDate), "MMMM d, yyyy")} at {trip.departureTime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Users className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Ýolagçylar</p>
                          <p className="text-muted-foreground text-sm">
                            {trip.passengers.length} of {trip.availableSeats}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <p className="text-sm">
                        <span className="font-medium">${trip.costPerPerson.toFixed(2)}</span>
                        <span className="text-muted-foreground">Her adam üçin</span>
                      </p>
                      <span className="text-sm px-2 py-1 rounded-full bg-muted">
                        {trip.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}