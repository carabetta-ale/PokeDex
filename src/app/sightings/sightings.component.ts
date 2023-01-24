import { Component } from '@angular/core';
import { SightingsService } from '../services/db.service';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../models/pokemon.interface';

@Component({
  selector: 'app-sightings',
  templateUrl: './sightings.component.html',
  styleUrls: ['./sightings.component.scss'],
})
export class SightingsComponent {
  constructor(
    private sightingsService: SightingsService,
    private pokemonService: PokemonService
  ) {}

  sighting: any = {};
  sightings: any[] = [];
  pokemons: Pokemon[] = [];
  searchTerm: string = '';
  formOpen: boolean = false;
  formDisplay: string = 'none';

  ngOnInit(): void {
    this.getCurrentPosition();
    this.getSightings();
    this.getPokemons();
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.sighting.location =
        position.coords.latitude.toFixed(4).toString() +
        ',' +
        position.coords.longitude.toFixed(4).toString();
    });
  }

  handleFileInput = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      var img = reader.result;
      this.sighting.image = img;
    };
    reader.readAsDataURL(file);
  };

  toggleForm() {
    this.formOpen = !this.formOpen;
    this.formDisplay = this.formOpen ? 'block' : 'none';
  }

  getPokemons(): void {
    this.pokemonService.getAllPokemonNames().subscribe((pokemons) => {
      this.pokemons = pokemons;
    });
  }

  addSighting(): void {
    this.getCurrentPosition();
    this.sighting.date = new Date();
    this.sightingsService.addSighting(this.sighting);
    this.sighting = {};
    this.getSightings();
  }

  getSightings(): void {
    this.sightingsService.getSightings().then((data) => {
      this.sightings = Array.from(data);
    });
  }

  deleteSighting(id: number): void {
    this.sightingsService.deleteSighting(id);
    this.getSightings();
  }

  updateSighting(sighting: any): void {
    this.sightingsService.updateSighting(sighting);
    this.getSightings();
  }
}
