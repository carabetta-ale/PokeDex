import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SightingsComponent } from './sightings/sightings.component';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';

const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'sightings', component: SightingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
