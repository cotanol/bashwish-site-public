"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectDate } from "../date/SelectDate";
import { Cake, Wand2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Theme {
  id: string;
  name: string;
  slug: string;
}

interface SearchVenueServiceProps {
  themes: Theme[];
}

export function SearchVenueService({ themes }: SearchVenueServiceProps) {
  const router = useRouter();

  // Updated form state with new fields
  const [venueForm, setVenueForm] = useState({
    kidsAge: "",
    gender: "neutral",
    numberOfKids: "",
    selectedTheme: "all",
    postalCode: "",
    eventDate: undefined as Date | undefined,
  });

  const [serviceForm, setServiceForm] = useState({
    selectedTheme: "all",
    specificRequest: "",
    kidsAge: "",
    eventDate: undefined as Date | undefined,
  });

  const handleVenueSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build URL params for navigation
    const params = new URLSearchParams();

    if (venueForm.kidsAge) params.append("age", venueForm.kidsAge);
    if (venueForm.gender && venueForm.gender !== "neutral")
      params.append("gender", venueForm.gender);
    if (venueForm.numberOfKids) params.append("kids", venueForm.numberOfKids);
    if (venueForm.selectedTheme && venueForm.selectedTheme !== "all")
      params.append("themes", venueForm.selectedTheme);
    if (venueForm.postalCode) params.append("zip", venueForm.postalCode);
    if (venueForm.eventDate)
      params.append("date", venueForm.eventDate.toISOString());

    // Navigate to /venues with search params
    router.push(`/venues?${params.toString()}`);
  };

  const handleServiceSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build URL params for navigation
    const params = new URLSearchParams();

    if (serviceForm.selectedTheme && serviceForm.selectedTheme !== "all")
      params.append("themes", serviceForm.selectedTheme);
    if (serviceForm.specificRequest)
      params.append("search", serviceForm.specificRequest);
    if (serviceForm.kidsAge) params.append("age", serviceForm.kidsAge);
    if (serviceForm.eventDate)
      params.append("date", serviceForm.eventDate.toISOString());

    // Navigate to /services with search params
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="pt-46 md:pt-52 lg:pt-60 px-4 sm:px-6 md:px-20 lg:px-40">
      <div className="flex w-full flex-col gap-4 md:gap-6">
        <Tabs defaultValue="venues">
          {/* CAMBIO AQUÍ: flex-row en lugar de flex-col, y usamos gap-2 para separar un poco en móvil */}
          <TabsList className="w-full h-auto flex flex-row sm:flex-row gap-2 sm:gap-4 p-0">
            <TabsTrigger
              className="hover:cursor-pointer flex-1 flex flex-row sm:flex-col py-3 sm:py-4 px-2 sm:px-0 rounded-lg border-2 border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658] bg-white hover:bg-[#F8BD36] data-[state=active]:text-[#1C3658] data-[state=active]:shadow-[3px_3px_0_#000000] data-[state=active]:border-[#000000] data-[state=active]:bg-[#F8BD36] transition-all"
              value="venues"
            >
              {/* CAMBIO AQUÍ: size-6 (antes size-5) */}
              <Cake className="size-6 sm:size-7 lg:size-8 mr-2 sm:mr-0 sm:mb-1 lg:mb-2 text-[#1C3658]" />
              <span className="text-[#1C3658] text-sm sm:text-base font-medium">
                Birthday Venues
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="hover:cursor-pointer flex-1 flex flex-row sm:flex-col py-3 sm:py-4 px-2 sm:px-0 rounded-lg border-2 border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658] bg-white hover:bg-[#F8BD36] data-[state=active]:text-[#1C3658] data-[state=active]:shadow-[3px_3px_0_#000000] data-[state=active]:border-[#000000] data-[state=active]:bg-[#F8BD36] transition-all"
              value="services"
            >
              {/* CAMBIO AQUÍ: size-6 (antes size-5) */}
              <Wand2 className="size-6 sm:size-7 lg:size-8 mr-2 sm:mr-0 sm:mb-1 lg:mb-2 text-[#1C3658]" />
              <span className="text-[#1C3658] text-sm sm:text-base font-medium">
                Birthday Services
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venues">
            <form onSubmit={handleVenueSearch}>
              <Card className="bg-[#1C3658] rounded-lg border-2 border-[#000000] shadow-[3px_3px_0_#000000]">
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6">
                  {/* 1. How old is your kid */}
                  <div className="grid gap-2 md:gap-3">
                    <Label
                      className="text-base md:text-lg font-normal text-white"
                      htmlFor="kidsAge"
                    >
                      How old is your kid?
                    </Label>
                    <Input
                      className="!text-sm md:!text-base !text-[#1C3658] bg-white placeholder:text-[#1C3658]/60 border-2 border-[#000000] shadow-[2px_2px_0_#000000]"
                      id="kidsAge"
                      type="number"
                      min="1"
                      max="18"
                      placeholder="e.g., 8"
                      value={venueForm.kidsAge}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          kidsAge: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 2. Girl/Boy/Both */}
                  <div className="grid gap-2 md:gap-3">
                    <Label
                      className="text-base md:text-lg font-normal text-white"
                      htmlFor="gender"
                    >
                      Gender Preference
                    </Label>
                    <Select
                      value={venueForm.gender}
                      onValueChange={(value) =>
                        setVenueForm({ ...venueForm, gender: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-2 border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658] w-full cursor-pointer !text-sm md:!text-base">
                        <SelectValue placeholder="Both (All)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutral">Both (All)</SelectItem>
                        <SelectItem value="boy">Boy</SelectItem>
                        <SelectItem value="girl">Girl</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 3. How many kids */}
                  <div className="grid gap-2 md:gap-3">
                    <Label
                      className="text-base md:text-lg font-normal text-white"
                      htmlFor="numberOfKids"
                    >
                      How many kids?
                    </Label>
                    <Input
                      className="!text-sm md:!text-base !text-[#1C3658] bg-white placeholder:text-[#1C3658]/60 border-2 border-[#000000] shadow-[2px_2px_0_#000000]"
                      id="numberOfKids"
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g., 15"
                      value={venueForm.numberOfKids}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          numberOfKids: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 4. Party theme (optional) */}
                  <div className="grid gap-2 md:gap-3">
                    <Label
                      className="text-base md:text-lg font-normal text-white"
                      htmlFor="theme"
                    >
                      Party Theme (Optional)
                    </Label>
                    <Select
                      value={venueForm.selectedTheme}
                      onValueChange={(value) =>
                        setVenueForm({ ...venueForm, selectedTheme: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-2 border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658] w-full cursor-pointer !text-sm md:!text-base">
                        <SelectValue placeholder="Any theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any theme</SelectItem>
                        {themes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 5. ZIP Code (optional) */}
                  <div className="grid gap-2 md:gap-3">
                    <Label
                      className="text-base md:text-lg font-normal text-white"
                      htmlFor="postalCode"
                    >
                      ZIP Code (Optional)
                    </Label>
                    <Input
                      className="!text-sm md:!text-base !text-[#1C3658] bg-white placeholder:text-[#1C3658]/60 border-2 border-[#000000] shadow-[2px_2px_0_#000000]"
                      id="postalCode"
                      type="text"
                      placeholder="e.g., 77494"
                      maxLength={5}
                      value={venueForm.postalCode}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 6. When planning to celebrate */}
                  <div className="grid gap-2 md:gap-3">
                    <SelectDate
                      value={venueForm.eventDate}
                      onChange={(date) =>
                        setVenueForm({ ...venueForm, eventDate: date })
                      }
                    />
                  </div>
                </CardContent>

                {/* Search Button */}
                <div className="px-4 md:px-6 pb-4 md:pb-6">
                  <Button
                    type="submit"
                    variant="golden"
                    size="golden"
                    className="w-full text-sm md:text-base"
                  >
                    Explore Venues
                  </Button>
                </div>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="services">
            <form onSubmit={handleServiceSearch}>
              <Card className="bg-[#1C3658] rounded-lg border-2 border-[#000000] shadow-[3px_3px_0_#000000]">
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6">
                  {/* 1. Service Type */}
                  <div className="grid gap-2 md:gap-3">
                    <Label
                      className="text-base md:text-lg font-normal text-white"
                      htmlFor="serviceTheme"
                    >
                      Service Type
                    </Label>
                    <Select
                      value={serviceForm.selectedTheme}
                      onValueChange={(value) =>
                        setServiceForm({ ...serviceForm, selectedTheme: value })
                      }
                    >
                      <SelectTrigger className="bg-white border-2 border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658] w-full cursor-pointer !text-sm md:!text-base">
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any type</SelectItem>
                        {themes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 2. Specific Request (Optional) */}
                  <div className="grid gap-2 md:gap-3">
                    <Label
                      className="text-base md:text-lg font-normal text-white"
                      htmlFor="specificRequest"
                    >
                      Specific Request (Optional)
                    </Label>
                    <Input
                      className="!text-sm md:!text-base !text-[#1C3658] bg-white placeholder:text-[#1C3658]/60 border-2 border-[#000000] shadow-[2px_2px_0_#000000]"
                      id="specificRequest"
                      type="text"
                      placeholder="e.g., Frozen, Superhero, etc."
                      value={serviceForm.specificRequest}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          specificRequest: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 3. How old is your kid */}
                  <div className="grid gap-2 md:gap-3">
                    <Label
                      className="text-base md:text-lg font-normal text-white"
                      htmlFor="serviceKidsAge"
                    >
                      How old is your kid?
                    </Label>
                    <Input
                      className="!text-sm md:!text-base !text-[#1C3658] bg-white placeholder:text-[#1C3658]/60 border-2 border-[#000000] shadow-[2px_2px_0_#000000]"
                      id="serviceKidsAge"
                      type="number"
                      min="1"
                      max="18"
                      placeholder="e.g., 8"
                      value={serviceForm.kidsAge}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          kidsAge: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* 4. When planning to celebrate */}
                  <div className="grid gap-2 md:gap-3">
                    <SelectDate
                      value={serviceForm.eventDate}
                      onChange={(date) =>
                        setServiceForm({ ...serviceForm, eventDate: date })
                      }
                    />
                  </div>
                </CardContent>

                {/* Search Button */}
                <div className="px-4 md:px-6 pb-4 md:pb-6">
                  <Button
                    type="submit"
                    variant="golden"
                    size="golden"
                    className="w-full text-sm md:text-base"
                  >
                    Explore Services
                  </Button>
                </div>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
