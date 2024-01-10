import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';

export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private loading$!: ReplaySubject<boolean>;

  constructor() {
    this.loading$ = new ReplaySubject<boolean>(1);
  }

  async managementToast(
    element: string,
    validRequest: boolean,
    error?: ResponseError
  ): Promise<void> {
    const toastMsg = document.getElementById(element);
    if (toastMsg) {
      if (validRequest) {
        toastMsg.className = "show requestOk";
        toastMsg.textContent = "Formulario enviado correctamente.";
        await this.wait(1000);
        toastMsg.className = toastMsg.className.replace("show", "");
      } else {
        toastMsg.className = "show requestKo";
        if (error?.messageDetail) {
          toastMsg.textContent =
            "Error enviando formulario, logs. Mensage: " +
            error?.message +
            ". Message detail: " +
            error?.messageDetail
            // + ". Status code: " +
            // error?.statusCode;
        } else {
          toastMsg.textContent =
            "Error enviando formulario, logs. Mensage: " +
            error?.message
            // + ". Status code: " +
            // error?.statusCode;
        }

        await this.wait(1000);
        toastMsg.className = toastMsg.className.replace("show", "");
      }
    }
  }
  errorLog(error: ResponseError): void {
    console.error("path:", error.path);
    console.error("timestamp:", error.timestamp);
    console.error("message:", error.message);
    console.error("messageDetail:", error.messageDetail);
    console.error("statusCode:", error.statusCode);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
  getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  setLoading(loading: boolean) {
    this.loading$.next(loading);
  }
}
