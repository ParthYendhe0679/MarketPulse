import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '../components/Card';

// Leaflet CSS is imported in index.html, but let's configure custom inline SVGs for markers to prevent missing asset errors.
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border: 3px solid #111111; border-radius: 50%; box-shadow: 2px 2px 0px 0px #111111;"></div>`,
    className: 'custom-leaflet-icon',
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};


const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Nagpur": { lat: 21.1458, lng: 79.0882 },
  "Nashik": { lat: 19.9975, lng: 73.7898 },
  "New Delhi": { lat: 28.6139, lng: 77.2090 },
  "Noida NCR": { lat: 28.5355, lng: 77.3910 },
  "Gurugram NCR": { lat: 28.4595, lng: 77.0266 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Mysore": { lat: 12.2958, lng: 76.6394 },
  "Hubli": { lat: 15.3647, lng: 75.1240 },
  "Mangalore": { lat: 12.9141, lng: 74.8560 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Madurai": { lat: 9.9252, lng: 78.1198 },
  "Trichy": { lat: 10.7905, lng: 78.7047 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Siliguri": { lat: 26.7271, lng: 88.3953 },
  "Howrah": { lat: 22.5958, lng: 88.2636 },
  "Durgapur": { lat: 23.5204, lng: 87.3119 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Surat": { lat: 21.1702, lng: 72.8311 },
  "Vadodara": { lat: 22.3072, lng: 73.1812 },
  "Rajkot": { lat: 22.3039, lng: 70.8022 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Kanpur": { lat: 26.4499, lng: 80.3319 },
  "Noida": { lat: 28.5355, lng: 77.3910 },
  "Agra": { lat: 27.1767, lng: 78.0081 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Jodhpur": { lat: 26.2389, lng: 73.0243 },
  "Udaipur": { lat: 24.5854, lng: 73.7125 },
  "Kota": { lat: 25.2138, lng: 75.8648 },
  "Kochi": { lat: 9.9312, lng: 76.2673 },
  "Trivandrum": { lat: 8.5241, lng: 76.9366 },
  "Kozhikode": { lat: 11.2588, lng: 75.7804 },
  "Thrissur": { lat: 10.5276, lng: 76.2144 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Warangal": { lat: 17.9689, lng: 79.5941 },
  "Nizamabad": { lat: 18.6725, lng: 78.0941 },
  "Khammam": { lat: 17.2473, lng: 80.1514 },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
  "Vijayawada": { lat: 16.5062, lng: 80.6480 },
  "Guntur": { lat: 16.3067, lng: 80.4365 },
  "Nellore": { lat: 14.4426, lng: 79.9865 }
};

interface LeafletMapProps {
  data: any[];
  activeState?: string;
  activeCity?: string;
  onSelectCity?: (city: string) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  data,
  activeState,
  activeCity,
  onSelectCity
}) => {
  // Aggregate data by city
  const cityData = React.useMemo(() => {
    const agg: Record<string, { revenue: number; consumers: number; state: string }> = {};
    data.forEach(r => {
      if (!agg[r.city]) {
        agg[r.city] = { revenue: 0, consumers: 0, state: r.state };
      }
      agg[r.city].revenue += r.revenue;
      agg[r.city].consumers += r.consumerCount;
    });

    return Object.entries(agg)
      .map(([name, val]) => ({
        name,
        state: val.state,
        lat: CITY_COORDINATES[name]?.lat || 20.5937,
        lng: CITY_COORDINATES[name]?.lng || 78.9629,
        revenue: val.revenue,
        consumers: val.consumers
      }))
      .filter(c => CITY_COORDINATES[c.name] !== undefined); // only plot those we have coords for
  }, [data]);

  // Center coordinate of map
  const mapCenter = React.useMemo(() => {
    if (activeCity && CITY_COORDINATES[activeCity]) {
      return [CITY_COORDINATES[activeCity].lat, CITY_COORDINATES[activeCity].lng] as [number, number];
    }
    if (activeState) {
      const stateCities = cityData.filter(c => c.state === activeState);
      if (stateCities.length > 0) {
        return [stateCities[0].lat, stateCities[0].lng] as [number, number];
      }
    }
    return [20.5937, 78.9629] as [number, number]; // center of India
  }, [activeState, activeCity, cityData]);

  const mapZoom = activeCity ? 9 : activeState ? 6 : 5;

  return (
    <Card hoverable={false} className="p-0 border-3 border-[#111111] overflow-hidden bg-white w-full h-[400px]">
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`} // force remount on center/zoom change
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {cityData.map((city) => {
          const isSelected = city.name === activeCity;
          const markerColor = isSelected ? '#FF9ECF' : '#4F7DF9';
          
          // Radius based on relative revenue
          const relativeRadius = Math.max(8000, Math.min(60000, Math.sqrt(city.revenue) * 50));

          return (
            <React.Fragment key={city.name}>
              {/* Heat radius */}
              <Circle
                center={[city.lat, city.lng]}
                radius={relativeRadius}
                pathOptions={{
                  fillColor: isSelected ? '#FF6B6B' : '#FFD54A',
                  fillOpacity: 0.35,
                  color: '#111111',
                  weight: 1.5
                }}
              />

              {/* Precise marker */}
              <Marker
                position={[city.lat, city.lng]}
                icon={createCustomIcon(markerColor)}
                eventHandlers={{
                  click: () => onSelectCity && onSelectCity(city.name),
                }}
              >
                <Popup>
                  <div className="font-sans text-xs">
                    <p className="font-bold text-[#111111] uppercase tracking-wide border-b-2 border-[#111111] pb-1 mb-1.5 flex items-center justify-between">
                      <span>{city.name}</span>
                      <span className="bg-[#6EE7B7] px-1 rounded border border-[#111111] text-[9px] font-semibold">{city.state}</span>
                    </p>
                    <p className="font-semibold text-gray-700">
                      Revenue: <strong className="text-black">₹{(city.revenue / 100000).toFixed(2)} L</strong>
                    </p>
                    <p className="font-semibold text-gray-700">
                      Consumers: <strong className="text-black">{city.consumers.toLocaleString()}</strong>
                    </p>
                    {onSelectCity && (
                      <button 
                        onClick={() => onSelectCity(city.name)}
                        className="mt-2 w-full py-1 bg-[#FFD54A] border-2 border-[#111111] rounded text-[10px] font-black uppercase text-center hover:bg-yellow-400 active:translate-y-0.5 shadow-[1.5px_1.5px_0px_0px_#111111]"
                      >
                        Drill Down
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </Card>
  );
};
