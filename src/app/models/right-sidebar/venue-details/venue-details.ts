import { OpeningHours } from './opening-hours';
import { DetailsMenu } from './details-menu';
import {VenueLocation} from './venue-location';

export interface VenueDetails {
  id: string;
  name: string;
  brand_guidelines: string;
  current_objective: string;
  special_offers: string;
  menus: DetailsMenu[];
  opening_hours: OpeningHours[];
  unique_selling_points: string;
  offers: string;
  message: string;
  values: string;
  tone_of_voice: string;
  hashtags: string;
  location: VenueLocation;
  brand_message: string;
  target_market: any[];
  local_attractions_and_events: any;
  demographic: any;
}
