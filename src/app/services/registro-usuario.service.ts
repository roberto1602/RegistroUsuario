import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroUsuarioService {

  private apiUrl = 'https://localhost:7166/';
  private apiController = 'api/User/'
  
  constructor(private http:HttpClient) { }

  getListaUsuarios(): Observable<any>{
    return this.http.get(this.apiUrl + this.apiController);
  }

  deleteUsuario(idUsuario:number): Observable<any>{
    return this.http.delete(this.apiUrl + this.apiController + idUsuario);
  }
  
  saveUsuario(user:any): Observable<any>{
    return this.http.post(this.apiUrl + this.apiController, user);
  }

  updateUsuario(idUsuario:number, User:any): Observable<any>{
    return this.http.put(this.apiUrl + this.apiController + idUsuario, User);
  }
}
