import { route$, page$, day$, meal$, profil$ } from '@/controllers/Router';
import { useFlux } from './useFlux';

export const useRoute = () => useFlux(route$);
export const usePage = () => useFlux(page$);
export const useDay = () => useFlux(day$);
export const useMeal = () => useFlux(meal$);
export const useProfil = () => useFlux(profil$);
