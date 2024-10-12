import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';





//const GIPHY_APY_KEY = 'PweNxoaKYyvPQ8VoLlrZllahm1G5OILj'    OTRA FORMA DE HACERLO


@Injectable({providedIn: 'root'})
export class GifsService {

    public gifList:Gif[] = []

    private _tagHistory: string[]= []
    private apiKey:      string = 'PweNxoaKYyvPQ8VoLlrZllahm1G5OILj'
    private serviceUrl:  string = 'http://api.giphy.com/v1/gifs'


    private http = inject (HttpClient) 
    

    constructor() { 
        this.loadLocalStorage()
        console.log('Gifs service ready')
    }

    // OnInit(){
    //     this.loadLocalStorage()
    //     console.log('Gifs Service ready!!!')
    // }
    

    get tagHistory(){
        return [...this._tagHistory]
    }

    //transformar y mantener el ultimo digitado al principio
    private organizeHistory(tag: string){
        tag = tag.toLowerCase();

        if (this._tagHistory.includes(tag)) {
            this._tagHistory = this._tagHistory.filter( (oldTag)=> oldTag !== tag )
        }
        //mandar arriba
        this._tagHistory.unshift(tag);
        //mantener los primeros 10 "eliminados"
        this._tagHistory = this.tagHistory.splice(0,10)
        this.saveLocalStorage()
    }


    private saveLocalStorage():void{
        localStorage.setItem('history', JSON.stringify( this._tagHistory))
    }

    private loadLocalStorage():void{
        if(!localStorage.getItem('history')) return;
        this._tagHistory = JSON.parse(localStorage.getItem('history')!)

        if(this._tagHistory.length === 0) return
        this.searchTag(this._tagHistory[0])
        
    }

    async searchTag (tag:string):Promise <void>{
        if ( tag.length === 0) return;
        this.organizeHistory(tag)
        // fetch('http://api.giphy.com/v1/gifs/search?api_key=PweNxoaKYyvPQ8VoLlrZllahm1G5OILj&q=valorant&limit=10')
        // .then(resp => resp.json())                               esto es para hacer con JAVASCRIPT
        // .then(data => console.log(data))
        const params = new HttpParams()
            .set('api_key', this.apiKey)
            .set('limit', '10')
            .set('q', tag)


        this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
        .subscribe( resp =>{
            this.gifList = resp.data
            console.log({gifs: this.gifList })
        })
        

    }

}