import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export type Coords = { latitude: number; longitude: number };
type State = { status: 'loading' | 'granted' | 'denied'; coords: Coords | null };

// Asks for foreground location once and returns it. "denied" also covers "location services are off".
export function useLocation() {
  const [state, setState] = useState<State>({ status: 'loading', coords: null });

  const request = useCallback(async () => {
    setState({ status: 'loading', coords: null });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState({ status: 'denied', coords: null });
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setState({
        status: 'granted',
        coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
      });
    } catch {
      setState({ status: 'denied', coords: null });
    }
  }, []);

  useEffect(() => {
    request();
  }, [request]);

  return { ...state, retry: request };
}
