import { Component, HostListener, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PokemonService } from '../services/pokemon.service';
import { PokemonFilterService } from '../services/pokemon-filter.service';
import { Pokemon } from '../models/pokemon.interface';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[];
  pokemon: Pokemon;
  searchTerm: string;
  currentPage = 1;
  lastPage = 120;
  limit = 10;
  error: boolean = false;
  errorMessage: string;
  searchCompleted: boolean = false;
  typeFilter: string = '';
  weightFilter: number;
  heightFilter: number;
  allPokemons: any[];
  loading: boolean = true;
  startX: number;
  startY: number;
  types = [];
  showClearSearchName: boolean = false;
  showClearForm: boolean = false;

  constructor(
    private pokemonService: PokemonService,
    private pokemonFilter: PokemonFilterService
  ) {}

  ngOnInit() {
    this.getPokemons();
    this.getAllPokemons();
    this.getAllTypes();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.nextPage();
    }
    if (event.key === 'ArrowLeft' && this.currentPage !== 1) {
      this.previousPage();
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.startX = event.changedTouches[0].clientX;
    this.startY = event.changedTouches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const distanceX = this.startX - endX;
    const distanceY = this.startY - endY;
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > 0 && this.currentPage !== 1) {
        this.previousPage();
      } else if (distanceX < 0) {
        this.nextPage();
      }
    }
  }

  getAllTypes() {
    this.pokemonService.getAllTypes().subscribe((types) => {
      this.types = types;
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.getPokemons();
    this.searchCompleted = false;
    this.errorMessage = '';
    this.showClearSearchName = false;
    this.showClearForm = false;
  }

  filterPokemonsByParams() {
    this.showClearForm = true;
    this.pokemons = this.pokemonFilter.filterPokemons(
      this.allPokemons,
      this.typeFilter,
      this.weightFilter,
      this.heightFilter
    );
    this.showClearForm = true;
  }

  getPokemons() {
    const offset = (this.currentPage - 1) * this.limit;
    this.pokemonService
      .getPokemons(offset, this.limit)
      .subscribe((pokemons) => {
        this.pokemons = pokemons;
        console.log(this.pokemons);
      });
  }

  getAllPokemons() {
    this.loading = true;
    this.pokemonService.getAllPokemons().subscribe((pokemons) => {
      this.allPokemons = pokemons;
      console.log(this.allPokemons);
      this.loading = false;
    });
  }

  searchPokemon() {
    this.showClearSearchName = true;
    if (!this.searchTerm || this.searchTerm.length === 0) {
      this.errorMessage = 'Inserire un valore valido per la ricerca';
      return;
    } else {
      this.errorMessage = '';
    }

    this.loading = true;
    this.pokemonService.getAllPokemonNames().subscribe((pokemons) => {
      if (pokemons) {
        this.pokemons = pokemons.filter((pokemon) =>
          pokemon.includes(this.searchTerm)
        );
        if (this.pokemons.length === 0) {
          this.errorMessage = 'Non ci sono risultati per la tua ricerca';
          this.loading = false;
        } else {
          this.error = false;
          let pokemonDetails = [];
          const requests = [];
          for (let i = 0; i < this.pokemons.length; i++) {
            if (i === 9) {
              break;
            }
            requests.push(this.pokemonService.searchPokemon(this.pokemons[i]));
          }
          forkJoin(requests).subscribe((results) => {
            pokemonDetails = results;
            this.pokemons = pokemonDetails;
            this.loading = false;
          });
        }
      }
    });
    this.searchCompleted = true;
  }

  nextPage() {
    if (this.currentPage === this.lastPage) {
      return;
    }
    this.currentPage++;
    this.getPokemons();
    window.scrollTo(0, 0);
  }

  previousPage() {
    if (this.currentPage === 1) {
      return;
    }
    this.currentPage--;
    this.getPokemons();
    window.scrollTo(0, 0);
  }

  getTypeColor(type: string) {
    switch (type) {
      case 'normal':
        return '#A8A878';
      case 'fire':
        return '#F08030';
      case 'water':
        return '#6890F0';
      case 'electric':
        return '#F8D030';
      case 'grass':
        return '#78C850';
      case 'ice':
        return '#98D8D8';
      case 'fighting':
        return '#C03028';
      case 'poison':
        return '#A040A0';
      case 'ground':
        return '#E0C068';
      case 'flying':
        return '#A890F0';
      case 'psychic':
        return '#F85888';
      case 'bug':
        return '#A8B820';
      case 'rock':
        return '#B8A038';
      case 'ghost':
        return '#705898';
      case 'dragon':
        return '#7038F8';
      case 'dark':
        return '#705848';
      case 'steel':
        return '#B8B8D0';
      case 'fairy':
        return '#EE99AC';
      default:
        return '#000000';
    }
  }
}
