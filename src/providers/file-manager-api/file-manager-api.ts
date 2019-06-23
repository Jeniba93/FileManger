import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the FileManagerApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileManagerApiProvider {
  private serverURL = environment.serverURL;
  public COM_headers:any = null;
  constructor(public http: HttpClient) {
    
    this.COM_headers = new HttpHeaders().set('Authorization','Bearer ' + localStorage.getItem('access_token'));
  }

  getfilebyuseraccess(foldername){
    return this.http.get(this.serverURL+'/files/getfilebyuseraccess1?folderid='+foldername,  { headers: this.COM_headers }).map(res => res);
  }

  getslider(){
    this.COM_headers = new HttpHeaders().set('Authorization','Bearer ' + localStorage.getItem('access_token'));
    return this.http.get(this.serverURL+'/slider/getAll',  { headers: this.COM_headers }).map(res => res);
  }

  getfolderdetails(){
    return this.http.get(this.serverURL+'/files/getfolderdetails1',  { headers: this.COM_headers }).map(res => res);
  }
  
  updatefileaccess(data){
    return this.http.put<any>(this.serverURL +'/files/updatefileaccess',data, { headers: this.COM_headers })
    .map((res:Response) =>{ return res;}) 
    .catch((err:any) => Observable.throw(err || 'Server error'));
  }


}
