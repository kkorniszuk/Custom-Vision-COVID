import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  // tslint:disable-next-line:max-line-length
  private readonly webApiUrl = 'https://westeurope.api.cognitive.microsoft.com/customvision/v3.0/Prediction/0ec6f9ad-037e-42d3-af26-38722fb77ac3/detect/iterations/Iteration2/image';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Prediction-Key': 'b8b6c6b4b47443a9b95f459f245820f6',
      'Content-Type': 'application/octet-stream'
    })
  };

  constructor(private http: HttpClient) {
  }

  public checkMask(image: any): Observable<any> {
    return this.http.post<any>(this.webApiUrl, image, this.httpOptions)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}

