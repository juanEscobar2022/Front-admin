import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "./../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class WebApiService {
  // VARIABLES
  token: string = "";
  urlKaysenBackend = environment.url;

  // PERMISOS DE APLICACION
  permission = null;

  // CONSTRUCTOR
  constructor(private _http: HttpClient) {}

  // ESTABLECE CABECERA
  setHeaders() {
    let headers = new HttpHeaders().append("Authorization", this.token);
    return headers;
  }

  // METODO GET
  getRequest(url: string, params: any): Observable<any> {
    params = this.processParams(params);
    let headers = this.setHeaders();
    url = this.urlKaysenBackend + url;
    return this._http.get<any>(url, { headers, params });
  }

  postRequest(url: string, body: any, params: any): Observable<any> {
    let headers = this.setHeaders();
    body = JSON.stringify(body);
    url = this.urlKaysenBackend + url;
    return this._http.post<any>(url, body, { headers, params });
  }

  // METODO PUT
  putRequest(url: string, body: any, params: any): Observable<any> {
    let headers = this.setHeaders();
    body = JSON.stringify(body);
    url = this.urlKaysenBackend + url;
    return this._http.put<any>(url, body, { headers, params });
  }

  //METODO CARGUE EXCEL
  uploadRequest(url: any, file: any, params: any): Observable<any> {

    let headers = this.setHeaders();
    let formData = new FormData();
    formData.append("file", file, file.name);

    url = this.urlKaysenBackend + url;
    return this._http.post<any>(url, formData, { headers, params });
  }

  // METODO DELETE
  deleteRequest(url: string, body: any, params: any) {
    let headers = this.setHeaders();
    params = Object.assign(body, params);
    params = this.processParams(params);
    url = this.urlKaysenBackend + url;
    return this._http.delete(url, { headers, params });
  }

  processParams(params: any) {
    let queryParams: { [key: string]: any } = {}; // Definir el tipo de queryParams

    for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
            queryParams[key] = params[key];
        }
    }

    return new HttpParams({ fromObject: queryParams });
}

 
  uploadFile(file: File, url: string, params: any): Observable<any> {
    const formData = new FormData();
    // params = this.processParams(params);
    let headers = this.setHeaders();

    url = this.urlKaysenBackend + url;
    formData.append("excelFile", file);
    console.log(formData);

    return this._http.post(url, formData, { headers, params });
  }
}
