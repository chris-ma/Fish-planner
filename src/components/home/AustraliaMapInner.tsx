"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useRouter } from "next/navigation";
import type { LatLngExpression } from "leaflet";

interface Region {
  id: string;
  slug: string;
  name: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
}

export default function AustraliaMapInner({ regions }: { regions: Region[] }) {
  const router = useRouter();
  const center: LatLngExpression = [-27, 134];
  const valid = regions.filter((r) => r.latitude != null && r.longitude != null);

  return (
    <MapContainer
      center={center}
      zoom={4}
      minZoom={3}
      maxZoom={8}
      style={{ height: "100%", width: "100%", background: "#020B14" }}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {valid.map((region) => (
        <CircleMarker
          key={region.id}
          center={[region.latitude!, region.longitude!] as LatLngExpression}
          radius={10}
          pathOptions={{
            fillColor: "#0D9488",
            fillOpacity: 0.9,
            color: "#14b8a6",
            weight: 2,
          }}
          eventHandlers={{
            click: () => router.push(`/regions/${region.slug}`),
            mouseover: (e) => e.target.setStyle({ fillOpacity: 1, radius: 13 }),
            mouseout: (e) => e.target.setStyle({ fillOpacity: 0.9, radius: 10 }),
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
            <span style={{ fontWeight: 600, fontSize: 12 }}>{region.name}</span>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
