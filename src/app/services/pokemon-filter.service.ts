import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PokemonFilterService {
  constructor() {}

  checkType(pokemon: any, typeFilter?: string) {
    if (!typeFilter) {
      return true;
    }
    return pokemon.types.some((type) => type.type.name === typeFilter);
  }

  checkWeight(pokemon: any, weightFilter?: number) {
    if (!weightFilter) {
      return true;
    }
    return pokemon.weight / 10 >= weightFilter;
  }

  checkHeight(pokemon: any, heightFilter?: number) {
    if (!heightFilter) {
      return true;
    }
    return pokemon.height / 10 >= heightFilter;
  }

  filterPokemons(
    pokemons: any[],
    typeFilter?: string,
    weightFilter?: number,
    heightFilter?: number
  ) {
    if (typeFilter) {
      pokemons = pokemons.filter((pokemon) =>
        this.checkType(pokemon, typeFilter)
      );
    }
    if (weightFilter) {
      pokemons = pokemons.filter((pokemon) =>
        this.checkWeight(pokemon, weightFilter)
      );
    }
    if (heightFilter) {
      pokemons = pokemons.filter((pokemon) =>
        this.checkHeight(pokemon, heightFilter)
      );
    }
    return pokemons;
  }
}
