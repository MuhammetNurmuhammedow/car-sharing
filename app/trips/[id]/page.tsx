"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Trip } from "@/types/trip";
import { 
  getTripById, 
  joinTrip, 
  leaveTrip, 
  cancelTrip 
} from "@/lib/trips";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Car, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  DollarSign,
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TripDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get trip ID from params
  const tripId = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!tripId) {
      router.push("/trips");
      return;
    }

    // Get trip details
    const tripDetails = getTripById(tripId);
    setTrip(tripDetails);
    setIsLoading(false);
  }, [tripId, router]);

  const handleJoinTrip = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to join trips.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }
    
    if (user.role === "driver") {
      toast({
        title: "Action not allowed",
        description: "Drivers cannot join trips.",
        variant: "destructive",
      });
      return;
    }
    
    if (!trip) return;
    
    try {
      const updatedTrip = joinTrip(tripId, user);
      
      if (updatedTrip) {
        setTrip(updatedTrip);
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

  const handleLeaveTrip = () => {
    if (!user || !trip) return;
    
    try {
      const updatedTrip = leaveTrip(tripId, user.id);
      
      if (updatedTrip) {
        setTrip(updatedTrip);
        toast({
          title: "Success!",
          description: "You've left the trip.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to leave trip",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleCancelTrip = () => {
    if (!user || !trip) return;
    
    // Check if user is the driver
    if (trip.driver.id !== user.id) {
      toast({
        title: "Action not allowed",
        description: "Only the trip driver can cancel the trip.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = cancelTrip(tripId);
      
      if (success) {
        // Update trip status
        setTrip((prev) => prev ? { ...prev, status: "cancelled" } : null);
        
        toast({
          title: "Trip cancelled",
          description: "The trip has been cancelled successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to cancel trip",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const isUserInTrip = () => {
    if (!user || !trip) return false;
    return trip.passengers.some((p) => p.id === user.id);
  };

  const isUserTripDriver = () => {
    if (!user || !trip) return false;
    return trip.driver.id === user.id;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground"> Syýahat maglumatlary ýüklenýär...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-10 px-4">
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Yza
          </Button>
          
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Syýahat tapylmady</h1>
            <p className="text-muted-foreground mb-6">
            Izleýän syýahatyňyz ýok ýa-da öçürildi.
            </p>
            <Button onClick={() => router.push("/trips")}>
            Bütün syýahatlary gözden geçiriň
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Yza
        </Button>
        
        {trip.status === "cancelled" && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p> Bu syýahat sürüji tarapyndan öçürildi.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {trip.startLocation.name} to {trip.endLocation.name}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(trip.departureDate), "EEEE, MMMM d, yyyy")} at {trip.departureTime}
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center text-primary">
                    <Car className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Başlangyç nokady</h3>
                        <p className="text-muted-foreground">{trip.startLocation.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Gidiljek ýer</h3>
                        <p className="text-muted-foreground">{trip.endLocation.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Date</h3>
                        <p className="text-muted-foreground">
                          {format(new Date(trip.departureDate), "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Ugraljak wagty</h3>
                        <p className="text-muted-foreground">{trip.departureTime}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Boş ýer sany</h3>
                        <p className="text-muted-foreground">
                          {trip.availableSeats - trip.passengers.length} of {trip.availableSeats} available
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Çykdajy</h3>
                        <p className="text-muted-foreground">
                          ${trip.costPerPerson.toFixed(2)} Adam başyna
                          <span className="block text-xs">
                            (Total: ${trip.totalCost.toFixed(2)}, Arasyndaky paý {trip.passengers.length + 1} Adamlar)
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Car className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Syýahatyň Haly</h3>
                        <div className="mt-1">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                            {trip.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {trip.description && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Syýahat Maglumatlary</h3>
                    <p className="text-muted-foreground">{trip.description}</p>
                  </div>
                )}
                
                {/* Map placeholder - in a real app, this would be a map component */}
                <div className="w-full h-[200px] bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Karta ugry şu ýerde görkeziler</p>
                </div>
                
                <div className="flex justify-between pt-4 border-t">
                  {!isUserTripDriver() && trip.status !== "cancelled" && (
                    isUserInTrip() ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline">Syýahatdan Çykmak</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hakykatdanam?</AlertDialogTitle>
                            <AlertDialogDescription>
                            Bu syýahatdan çykarmagyňyzy üpjün eder. Elýeterli oturgyçlar galdygynda soňra gaýtadan goşulyp bilersiňiz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Öçir</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLeaveTrip}>Syýahatdan Çykmak</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button 
                        onClick={handleJoinTrip}
                        disabled={trip.availableSeats <= trip.passengers.length}
                      >
                        Syýahata Goşul
                      </Button>
                    )
                  )}
                  
                  {isUserTripDriver() && trip.status !== "cancelled" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Syýahaty öçir</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hakykatdanam</AlertDialogTitle>
                          <AlertDialogDescription>
                          Bu, ähli ýolagçylar üçin syýahaty öçürer. Bu hereket yzyna gaýtarylyp bilinmez.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Ýok, syýahaty sakla</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleCancelTrip}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Hawa, syýahaty öçür
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Süriji</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-6">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getInitials(trip.driver.firstName, trip.driver.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {trip.driver.firstName} {trip.driver.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">@{trip.driver.username}</p>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                Sürüji bilen aragatnaşyk gurmak
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ýolagçy ({trip.passengers.length}/{trip.availableSeats})</CardTitle>
              </CardHeader>
              <CardContent>
                {trip.passengers.length === 0 ? (
                  <p className="text-muted-foreground">Bu syýahata heniz hiç bir ýolagçy goşulman.</p>
                ) : (
                  <div className="space-y-4">
                    {trip.passengers.map((passenger) => (
                      <div key={passenger.id} className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {getInitials(passenger.firstName, passenger.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {passenger.firstName} {passenger.lastName}
                          </h3>
                          <p className="text-xs text-muted-foreground">@{passenger.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}