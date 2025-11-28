"use client";

import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useMemo, useState, useEffect, useRef } from "react";
import SearchIcon from "../assets/icons/searchIcon";

// Styles moved to CSS: see .map-container in dashboard.css

// Define libraries outside component to prevent re-renders
const libraries: ("places")[] = ["places"];

interface PlaceSuggestion {
  name: string;
  placeId: string;
}

export interface SelectedPlace {
  name: string;
  lat: number;
  lng: number;
}

interface GMapProps {
  onLocationConfirm?: (place: SelectedPlace) => void;
}

export default function GMap({ onLocationConfirm }: GMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 59.9343, lng: 30.3351 });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  const center = useMemo(() => mapCenter, [mapCenter]);

  // Initialize Google Places services
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      const mapDiv = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(mapDiv);
    }
  }, [isLoaded]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search for places using Google Places Autocomplete
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length >= 1 && autocompleteService.current) {
      setShowSuggestions(true);
      
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['(cities)'], // Search for cities only
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(
              predictions.map(prediction => ({
                name: prediction.description,
                placeId: prediction.place_id,
              }))
            );
          } else {
            setSuggestions([]);
          }
        }
      );
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handlePlaceSelect = (suggestion: PlaceSuggestion) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      {
        placeId: suggestion.placeId,
        fields: ['name', 'geometry'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setSelectedPlace({
            name: suggestion.name,
            lat,
            lng,
          });
          setSearchQuery(suggestion.name);
          setShowSuggestions(false);
          setShowConfirmModal(true);
        }
      }
    );
  };

  const handleConfirm = () => {
    if (selectedPlace) {
      setShowConfirmModal(false);
      setShowLoading(true);

      if (onLocationConfirm) {
        onLocationConfirm(selectedPlace);
      }
      
      // Simulate analysis/loading for 2.5 seconds
      setTimeout(() => {
        setMapCenter({ lat: selectedPlace.lat, lng: selectedPlace.lng });
        setShowLoading(false);
      }, 2500);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setSearchQuery("");
    setSelectedPlace(null);
  };

  if (loadError) return <div>Ошибка загрузки карты</div>;
  if (!isLoaded) return <div>Загрузка карты…</div>;

  return (
    <div className="map-container-wrapper">
      {/* Search Input Overlay */}
      <div className="map-search-overlay" ref={searchRef}>
        <div className="map-search-input-wrapper">
          <div className="search-icon-wrapper">
            <img src="/images/search_icon.png" alt="" />
          </div>
          <input
            type="text"
            className="map-search-input"
            placeholder="Введите место"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchQuery.length >= 1 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
        </div>

        {/* Autocomplete Suggestions - Hidden Div */}
        <div className={`map-suggestions-dropdown ${showSuggestions && suggestions.length > 0 ? 'show' : ''}`}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="map-suggestion-item"
              onClick={() => handlePlaceSelect(suggestion)}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      </div>

      {/* Google Map */}
      <GoogleMap
        mapContainerClassName="map-container"
        center={center}
        zoom={12}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <MarkerF position={center} />
      </GoogleMap>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPlace && (
        <div className="map-confirm-overlay">
          <div className="map-confirm-modal">
            <h3 className="map-confirm-title">Подтвердите выбор региона</h3>
            <p className="map-confirm-city">{selectedPlace.name}</p>
            <div className="map-confirm-buttons">
              <button className="map-confirm-btn" onClick={handleConfirm}>
                Подтвердить
              </button>
              <button className="map-cancel-btn" onClick={handleCancel}>
                Отказаться
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Analysis Overlay */}
      {showLoading && (
        <div className="map-loading-overlay">
          <div className="map-loading-content">
            <div className="dots-loader">
              {[...Array(12)].map((_, index) => (
                <div key={index} className={`dot dot-${index + 1}`}></div>
              ))}
            </div>
            <p className="map-loading-text">
              Анализ гидрологической и метеорологической обстановки в выбранном регионе
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
