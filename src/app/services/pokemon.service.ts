import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { of, forkJoin } from "rxjs";
import { map, catchError, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private cache = new Map<string, any>();

  constructor(private http: HttpClient) {}

  getPokemons(offset: number, limit: number) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    if (this.cache.has(url)) {
      return of(this.cache.get(url));
    }

    return this.http.get(url).pipe(
      switchMap((response: any) => {
        const pokemonRequests = response.results.map((pokemon) => {
          return this.http.get(pokemon.url);
        });
        return forkJoin(pokemonRequests);
      }),
      map((pokemons) => {
        this.cache.set(`${offset}-${limit}`, pokemons);
        return pokemons;
      }),
      catchError((error) => {
        console.log(error);
        return of([]);
      })
    );
  }

  getAllPokemonNames() {
    return this.http
      .get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=1200`)
      .pipe(
        switchMap((response: any) => {
          return of(response.results.map((pokemon) => pokemon.name));
        }),
        catchError((error) => {
          console.log(error);
          return of([]);
        })
      );
  }

  getAllPokemons() {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=1200`;
    if (this.cache.has(url)) {
      return of(this.cache.get(url));
    }

    return this.http.get(url).pipe(
      switchMap((response: any) => {
        const pokemonRequests = response.results.map((pokemon) => {
          return this.http.get(pokemon.url);
        });
        return forkJoin(pokemonRequests);
      }),
      map((pokemons) => {
        this.cache.set(url, pokemons);
        return pokemons;
      }),
      catchError((error) => {
        console.log(error);
        return of([]);
      })
    );
  }

  searchPokemon(term: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${term}`).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.log(error);
        return of([]);
      })
    );
  }

  getAllTypes() {
    return this.http.get("https://pokeapi.co/api/v2/type").pipe(
      switchMap((response: any) => {
        return of(response.results.map((type) => type.name));
      }),
      catchError((error) => {
        console.log(error);
        return of([]);
      })
    );
  }
}
