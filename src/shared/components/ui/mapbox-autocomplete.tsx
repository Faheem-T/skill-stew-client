import { useEffect, useRef } from "react";
import type { CurrentUserLocation } from "@/shared/api/currentUserProfile";
import { SearchBox } from "@mapbox/search-js-react";

export const MapBoxAutocomplete: React.FC<{
  onPlaceSelected: (place: CurrentUserLocation) => void;
}> = ({ onPlaceSelected }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const listbox = target.closest("mapbox-search-listbox");
      const container = containerRef.current;

      if (!listbox || !container) {
        return;
      }

      // Mapbox commits a selection on click. Inside a dialog, the initial
      // pointer press can blur the input and collapse the list before click.
      if (listbox.parentElement === container) {
        event.preventDefault();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <SearchBox
        accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        onRetrieve={(res) => {
          const { coordinates, name } = res.features[0].properties;
          onPlaceSelected({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            formattedAddress: name,
          });
        }}
      />
    </div>
  );
};
