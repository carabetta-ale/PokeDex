import { Injectable } from "@angular/core";
import Dexie from "dexie";

@Injectable({
  providedIn: "root",
})
export class SightingsService {
  db: any;
  constructor() {
    this.db = new Dexie("PokedexDB");
    this.db.version(1).stores({
      sightings: "++id, image, pokemonName, location, date, notes",
    });
    this.db.open();
  }

  addSighting(sighting: any): void {
    this.db.sightings.put(sighting);
  }

  getSightings(): any {
    return this.db.sightings.toArray();
  }

  deleteSighting(id: number): void {
    this.db.sightings.delete(id);
  }

  updateSighting(sighting: any): void {
    this.db.sightings.update(sighting.id, sighting);
  }
}
