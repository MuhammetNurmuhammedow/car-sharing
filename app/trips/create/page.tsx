"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TripFormData } from "@/types/trip";
import { createTrip } from "@/lib/trips";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateTripPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<TripFormData>({
    startLocationName: "",
    startLocationLat: 0,
    startLocationLng: 0,
    endLocationName: "",
    endLocationLat: 0,
    endLocationLng: 0,
    departureDate: new Date(),
    departureTime: "09:00",
    availableSeats: 3,
    totalCost: 0,
    description: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Redirect if not logged in or not a driver
    if (!isLoading && (!user || user.role !== "driver")) {
      toast({
        title: "Access denied",
        description: "Only drivers can create trips.",
        variant: "destructive",
      });
      router.push("/dashboard");
    }
  }, [user, isLoading, router, toast]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.startLocationName.trim()) {
      newErrors.startLocationName = "Starting point is required";
    }

    if (!formData.endLocationName.trim()) {
      newErrors.endLocationName = "Destination is required";
    }

    if (!formData.departureTime) {
      newErrors.departureTime = "Departure time is required";
    }

    if (formData.availableSeats <= 0) {
      newErrors.availableSeats = "At least 1 seat must be available";
    }

    if (formData.totalCost <= 0) {
      newErrors.totalCost = "Total cost must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: 0 }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, departureDate: date }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    // Simulate coordinates since we don't have a real geocoding service
    const startLat = Math.random() * 180 - 90;
    const startLng = Math.random() * 360 - 180;
    const endLat = Math.random() * 180 - 90;
    const endLng = Math.random() * 360 - 180;

    try {
      const tripWithCoords: TripFormData = {
        ...formData,
        startLocationLat: startLat,
        startLocationLng: startLng,
        endLocationLat: endLat,
        endLocationLng: endLng,
      };

      const newTrip = createTrip(tripWithCoords, user);

      toast({
        title: "Trip created successfully",
        description: "Your trip has been created and is now available for passengers to join.",
      });

      router.push(`/trips/${newTrip.id}`);
    } catch (error) {
      toast({
        title: "Failed to create trip",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  if (user.role !== "driver") {
    return null; // Will redirect in useEffect
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
          Back
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Täze syýahat döretmek</CardTitle>
            <CardDescription>
            Ýol tanyşyklaryny tapmaga başlamak üçin syýahatyňyz üçin maglumatlary giriziň
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Ýol Maglumatlary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startLocationName">Başlangyç Nokady</Label>
                    <Input
                      id="startLocationName"
                      name="startLocationName"
                      placeholder="e.g., New York"
                      value={formData.startLocationName}
                      onChange={handleChange}
                    />
                    {errors.startLocationName && (
                      <p className="text-sm text-destructive">
                        {errors.startLocationName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endLocationName">Gidiljek ýer</Label>
                    <Input
                      id="endLocationName"
                      name="endLocationName"
                      placeholder="e.g., Boston"
                      value={formData.endLocationName}
                      onChange={handleChange}
                    />
                    {errors.endLocationName && (
                      <p className="text-sm text-destructive">
                        {errors.endLocationName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Syýahat Maglumatlary</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Ugraljak Wagty</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="departureDate"
                          className={cn(
                            "w-full justify-start text-left font-normal"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.departureDate ? (
                            format(formData.departureDate, "PPP")
                          ) : (
                            <span> Bir senä saýlaň</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.departureDate}
                          onSelect={handleDateChange}
                          initialFocus
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Ugraljak Wagty</Label>
                    <Input
                      id="departureTime"
                      name="departureTime"
                      type="time"
                      value={formData.departureTime}
                      onChange={handleChange}
                    />
                    {errors.departureTime && (
                      <p className="text-sm text-destructive">
                        {errors.departureTime}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availableSeats">Elýeterli Otuşyçlar</Label>
                    <Input
                      id="availableSeats"
                      name="availableSeats"
                      type="number"
                      min="1"
                      value={formData.availableSeats}
                      onChange={handleNumberChange}
                    />
                    {errors.availableSeats && (
                      <p className="text-sm text-destructive">
                        {errors.availableSeats}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Çykdajy we Geňeş Maglumatlary</h3>

                <div className="space-y-2">
                  <Label htmlFor="totalCost">
                  Jemi Syýahat Çykdajy (TMT)
                    <span className="text-xs text-muted-foreground ml-2">
                      (Bütün syýahatçylar arasynda deň paýlanar)
                    </span>
                  </Label>
                  <Input
                    id="totalCost"
                    name="totalCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalCost}
                    onChange={handleNumberChange}
                  />
                  {errors.totalCost && (
                    <p className="text-sm text-destructive">
                      {errors.totalCost}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                  Syýahatyň Beýany
                    <span className="text-xs text-muted-foreground ml-2">
                      (Hökman däl)
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Add any details about the trip, stops along the way, or any other information passengers might find helpful."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Öçür
              </Button>
              <Button type="submit">Syýahaty Döret</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}