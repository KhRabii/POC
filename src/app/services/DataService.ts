import { HttpClient } from '@angular/common/http';
import {Injectable} from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  readonly endpointUrl = 'http://127.0.0.1:5000/correlation';


  getCorrelationMatrix() {
    return this.http.get<any>(this.endpointUrl);
  }
}
