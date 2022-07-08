import React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useDeepCompareEffectForMaps } from "./helpers";
import WeatherTable from './weathertable';

const App: React.FC<{}> = () => {
  const [coordinates, setCoordinates] = React.useState<google.maps.LatLng>(
    new google.maps.LatLng(
      40.7608,
      -111.8910,
    )
  );
  const [zoom, setZoom] = React.useState(5);

  const onClick = (e: google.maps.MapMouseEvent) => {
    setCoordinates(e.latLng!);
  };
  
  const onRelease = (e: google.maps.MapMouseEvent) => {
    setCoordinates(e.latLng!);
  };

  // Necessary to retain zoom level on re-render to set new default zoom
  const updateZoom = (map: { [ key: string ]: any } ) => {
    setZoom(map.zoom);
  };

  interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    onClick: (e: google.maps.MapMouseEvent) => void;
    children: React.ReactNode;
  }
  
  const Map: React.FC<MapProps> = ({
    style,
    onClick,
    children,
    ...options
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();
    
    React.useEffect(() => {
      if (ref.current && !map) {
        setMap(new window.google.maps.Map(ref.current));
      }
    }, [ref, map]);

    useDeepCompareEffectForMaps(() => {
      if (map) {
        map.setOptions(options);
      }
    }, [map, options]);

    React.useEffect(() => {
      if (map) {
        ["click, zoom_changed"].forEach((eventName) => {
          google.maps.event.clearListeners(map, eventName)
        });

        onClick && map.addListener("click", onClick);
        
        updateZoom && map.addListener("zoom_changed", () => updateZoom(map));
      }
    }, [map, onClick]);

    return (
      <>
        <div ref={ref} style={style}/>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { map });
          }
        })};
      </>
    )
  };

  const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
    const [marker, setMarker] = React.useState<google.maps.Marker>();
  
    React.useEffect(() => {
      !marker && setMarker(new google.maps.Marker());
  
      return () => {
        marker && marker.setMap(null);
      }
    }, [marker]);
  
    React.useEffect(() => {
      marker && marker.setOptions(options);
  
      onRelease && marker?.addListener("mouseup", onRelease);
    }, [marker, options]);
  
    return null;
  };

  const render = (status: Status) => {
    return <h1>{status}</h1>
  };

  return (
    <>
      <h2>Click a point on the map to see current weather information for that location</h2>
      <div className="map-container">
        <Wrapper apiKey={`${process.env.REACT_APP_MAPS_KEY}`} render={render}>
          <Map
            style={{ height: "850px", width: "1000px", }}
            onClick={onClick}
            center={coordinates}
            zoom={zoom}
          >
            <Marker position={coordinates} draggable={true} />
          </Map>
          <WeatherTable coordinates={coordinates} />
        </Wrapper>
      </div>
    </>
  );
};

export default App;