import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import React, { useEffect, useRef } from "react";

// Set the options for loading the API.
setOptions({ key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

await importLibrary("places");

export const GoogleMapsAutocomplete: React.FC<{
  onPlaceSelected: (place: any) => void;
}> = ({ onPlaceSelected }) => {
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    let autocompleteEl: any;
    const container = autocompleteRef.current;
    if (!container) return;

    const load = async () => {
      // Create the element
      autocompleteEl = new google.maps.places.PlaceAutocompleteElement({});

      // Listen for place selection
      autocompleteEl.addEventListener("gmp-select", async (e: any) => {
        const place = e.placePrediction.toPlace();
        await place.fetchFields({
          fields: ["id"],
        });

        onPlaceSelected(place.toJSON());
      });

      container.appendChild(autocompleteEl);
    };

    load();
    return () => {
      //   Empty the container of all child elements
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [autocompleteRef]);

  return (
    <div>
      {/* container where web component will be inserted */}
      <div ref={autocompleteRef} />
    </div>
  );
};
