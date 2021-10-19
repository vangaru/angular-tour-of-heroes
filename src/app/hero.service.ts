import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService) {
  }

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  getHero(id: Number): Observable<Hero> {
    const heroUrl = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(heroUrl)
      .pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id} ${newHero.name}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero(id: Number): Observable<Hero> {
    const heroUrl = `${this.heroesUrl}/${id}`;
    return this.httpClient.delete<Hero>(heroUrl, this.httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);
    return this.httpClient.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap (match => match.length
          ? this.log(`found heroes matching ${term}`)
          : this.log(`no heroes matching ${term}`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  private handleError<T>(operation='operation', result?: T) {
    return (error: any): Observable<any> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

}
