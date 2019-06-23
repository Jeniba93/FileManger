import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthProvider { 
  public COM_headers:any = null;
  private serverURL = environment.serverURL;
  constructor(public http: HttpClient) {
    console.log('Hello AuthProvider Provider');
    this.COM_headers = new HttpHeaders().set('Authorization','Bearer ' + localStorage.getItem('access_token'));

  }

  authenticate(logindata)
    {          
    return this.http.post<any>(this.serverURL +'/users/authenticate',logindata)
                    .map(result => {
                        localStorage.setItem('access_token', result.token);
                        localStorage.setItem('USER_INFO', JSON.stringify(result));
                        return true;
                    })
                    .catch((err:any) => Observable.throw(err || 'Login error'));
    }

    register(data)
    {          
    return this.http.post<any>(this.serverURL +'/users/register',data)
                    .map((res:Response) =>{ return res;}) 
                    .catch((err:any) => Observable.throw(err || 'Server error'));
    }
    updateProfile(data)
    {          
    
    return this.http.post<any>(this.serverURL +'/users/updateuser',data,  { headers: this.COM_headers })
                    .map((res:Response) =>{ return res;}) 
                    .catch((err:any) => Observable.throw(err || 'Server error'));
    }
    forgotPassword(data)
    {          
      return this.http.put(this.serverURL +'/users/forgotpassword',data)
                      .map((res:Response) =>{ return res;}) 
                      .catch((err:any) => Observable.throw(err || 'Server error'));
    }
    changepassword(data)
    {          
      return this.http.put(this.serverURL +'/users/changepassword',data,  { headers: this.COM_headers })
                      .map((res:Response) =>{ return res;}) 
                      .catch((err:any) => Observable.throw(err || 'Server error'));
    }
    resendActMail(data)
    {          
      return this.http.put(this.serverURL +'/users/resendLink',data)
                      .map((res:Response) =>{ return res;}) 
                      .catch((err:any) => Observable.throw(err || 'Server error'));
    }

    logout(logoutdata) {
      this.COM_headers = new HttpHeaders().set('Authorization','Bearer ' + localStorage.getItem('access_token'));
       return this.http.post<any>(this.serverURL +'/users/logout',logoutdata,  { headers: this.COM_headers })
                    .map(result => {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('USER_INFO');
                        return true;
                    })
                    .catch((err:any) => Observable.throw(err || 'Login error'));
     
    }
  
    public get loggedIn(): boolean {
      return (localStorage.getItem('access_token') !== null);
    }

    

}
