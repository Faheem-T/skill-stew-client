import type { CurrentUserLocation } from "@/shared/api/currentUserProfile";
import { SearchBox } from "@mapbox/search-js-react";

export const MapBoxAutocomplete: React.FC<{
  onPlaceSelected: (place: CurrentUserLocation) => void;
}> = ({ onPlaceSelected }) => {
  return (
    <SearchBox
      accessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      onRetrieve={(res) => {
        const { coordinates, name } = res.features[0].properties;
        console.log(res);
        onPlaceSelected({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          formattedAddress: name,
        });
      }}
    />
  );
};
