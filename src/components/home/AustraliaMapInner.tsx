"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useRouter } from "next/navigation";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

interface Region {
  id: string;
  slug: string;
  name: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
}

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length === 0) return;
    map.fitBounds(L.latLngBounds(coords), { padding: [50, 50], maxZoom: 7 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function AustraliaMapInner({ regions }: { regions: Region[] }) {
  const router = useRouter();
  const valid = regions.filter((r) => r.latitude != null && r.longitude != null);
  const coords = valid.map((r) => [r.latitude!, r.longitude!] as [number, number]);

  return (
    <MapContainer
      center={[-27, 134]}
      zoom={4}
      minZoom={3}
      maxZoom={8}
      style={{ height: "100%", width: "100%", background: "#0A1C28" }}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      <FitBounds coords={coords} />

      {valid.map((region) => (
        <CircleMarker
          key={region.id}
          center={[region.latitude!, region.longitude!] as LatLngExpression}
          radius={10}
          pathOptions={{
            fillColor: "#C99A3E",
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
