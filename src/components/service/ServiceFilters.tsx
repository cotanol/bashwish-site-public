"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Theme {
  id: string;
  name: string;
  slug: string;
}

interface ServiceFiltersProps {
  themes: Theme[];
  initialFilters?: {
    search?: string;
    kids?: number;
    age?: number;
    gender?: string;
    selectedThemes?: string[];
  };
}

export default function ServiceFilters({
  themes,
  initialFilters,
}: ServiceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL params or props
  const [filters, setFilters] = useState({
    search: initialFilters?.search || searchParams.get("search") || "",
    kids: initialFilters?.kids?.toString() || searchParams.get("kids") || "",
    age: initialFilters?.age?.toString() || searchParams.get("age") || "",
    gender: initialFilters?.gender || searchParams.get("gender") || "neutral",
    themes:
      initialFilters?.selectedThemes ||
      searchParams.get("themes")?.split(",") ||
      [],
  });

  // Apply filters - update URL and trigger search
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.kids) params.append("kids", filters.kids);
    if (filters.age) params.append("age", filters.age);
    if (filters.gender && filters.gender !== "neutral")
      params.append("gender", filters.gender);
    if (filters.themes.length > 0)
      params.append("themes", filters.themes.join(","));

    router.push(`/services?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: "",
      kids: "",
      age: "",
      gender: "neutral",
      themes: [],
    });
    router.push("/services");
  };

  // Handle theme checkbox toggle
  const toggleTheme = (themeId: string) => {
    setFilters((prev) => ({
      ...prev,
      themes: prev.themes.includes(themeId)
        ? prev.themes.filter((id) => id !== themeId)
        : [...prev.themes, themeId],
    }));
  };

  return (
    <aside className="bg-[#F8BD36] p-6 w-full border border-[#000000] shadow-[3px_3px_0_#000000] self-start space-y-6">
      <h3 className="text-2xl font-bold text-[#1C3658] mb-4">
        Filter Services
      </h3>
      <div className="grid grid-cols-2 gap-6">
        {/* Search by Name */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="search" className="text-[#1C3658] font-semibold">
            Search by Name
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Search services..."
            className="bg-white border border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658]"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Number of Kids */}
        <div className="space-y-2">
          <Label htmlFor="kids" className="text-[#1C3658] font-semibold">
            How many kids?
          </Label>
          <Input
            id="kids"
            type="number"
            min="1"
            max="100"
            placeholder="e.g., 15"
            className="bg-white border border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658]"
            value={filters.kids}
            onChange={(e) => setFilters({ ...filters, kids: e.target.value })}
          />
        </div>

        {/* Age Range */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-[#1C3658] font-semibold">
            Kid&apos;s Age
          </Label>
          <Input
            id="age"
            type="number"
            min="1"
            max="18"
            placeholder="e.g., 8"
            className="bg-white border border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658]"
            value={filters.age}
            onChange={(e) => setFilters({ ...filters, age: e.target.value })}
          />
        </div>

        {/* Gender Focus */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="gender" className="text-[#1C3658] font-semibold">
            Gender Focus
          </Label>
          <Select
            value={filters.gender}
            onValueChange={(value) => setFilters({ ...filters, gender: value })}
          >
            <SelectTrigger className="bg-white border border-[#000000] shadow-[2px_2px_0_#000000] text-[#1C3658] cursor-pointer ">
              <SelectValue placeholder="Select gender focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral / Any</SelectItem>
              <SelectItem value="boy">Boy&apos;s Party</SelectItem>
              <SelectItem value="girl">Girl&apos;s Party</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Party Themes */}
        {themes.length > 0 && (
          <div className="space-y-3 col-span-2">
            <Label className="text-[#1C3658] font-semibold">Party Themes</Label>
            <div className="max-h-64 overflow-y-auto space-y-2 bg-white p-3 border border-[#000000] shadow-[2px_2px_0_#000000] rounded-md">
              {themes.map((theme) => (
                <label
                  key={theme.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.themes.includes(theme.id)}
                    onChange={() => toggleTheme(theme.id)}
                    className="w-4 h-4 text-[#F8BD36] border-[#1C3658] rounded focus:ring-[#F8BD36] cursor-pointer"
                  />
                  <span className="text-sm text-[#1C3658]">{theme.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="col-span-2 flex gap-3">
          <Button
            onClick={applyFilters}
            className="flex-1 bg-[#1C3658] hover:bg-[#2a4a73] text-white border border-[#000000] shadow-[2px_2px_0_#000000] cursor-pointer"
          >
            Apply Filters
          </Button>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="flex-1 border-[#1C3658] text-[#1C3658] hover:bg-[#1C3658] hover:text-white shadow-[2px_2px_0_#000000] cursor-pointer"
          >
            Clear All
          </Button>
        </div>
      </div>
    </aside>
  );
}
