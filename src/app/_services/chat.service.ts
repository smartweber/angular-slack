import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {
  host: string;

  constructor(private http: HttpClient) {
    this.host = 'http://localhost:3000';
  }

  getChats() {
    return new Promise((resolve, reject) => {
      this.http.get(this.host + '/api/allChats')
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  saveChat(data) {
    return new Promise((resolve, reject) => {
        this.http.post(this.host + '/api/saveChat', data)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
