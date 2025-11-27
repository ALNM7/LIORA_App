import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WatchImage {
  id: number;
  image: string;
  order: number;
}

export interface WatchItem {
  id: number;
  name: string;
  category: string;
  materials: string;
  price: number;
  is_active: boolean;
  images: WatchImage[];
}

@Injectable({ providedIn: 'root' })
export class WatchService {
  
  private baseUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  getAll(params?: { category?: string; ordering?: string }): Observable<WatchItem[]> {
    let url = `${this.baseUrl}watches/all`;

    const qs: string[] = [];
    if (params?.category) {
      qs.push(`category=${encodeURIComponent(params.category)}`);
    }
    if (params?.ordering) {
      qs.push(`ordering=${encodeURIComponent(params.ordering)}`);
    }
    if (qs.length) {
      url += `?${qs.join('&')}`;
    }

    // aquí ya no hay confusión de tipos: siempre es Observable<WatchItem[]>
    return this.http.get<WatchItem[]>(url);
  }

  getOne(id: number): Observable<WatchItem> {
    const url = `${this.baseUrl}watches?id=${id}`;
    return this.http.get<WatchItem>(url);
  }

  fullImageUrl(path: string): string {
    if (!path) {
      return '';
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    // igual que en JewelryService: base + path (que empieza con /media/...)
    return `${this.baseUrl.replace(/\/$/, '')}${path}`;
  }
}
