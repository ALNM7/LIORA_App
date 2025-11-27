import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface HighJewelryImage {
  id: number;
  image: string;
  order: number;
}

export interface HighJewelryItem {
  id: number;
  name: string;
  category: string;
  materials: string;
  price: number;
  is_active: boolean;
  images: HighJewelryImage[];
}

export interface HighJewelryQuery {
  category?: string;
  ordering?: string;
}

export interface HighJewelryCreatePayload {
  name: string;
  category: string;
  materials: string;
  price: number;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class JewelryService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getHighJewelry(query?: HighJewelryQuery) {
    let params = new HttpParams();
    if (query?.category) {
      params = params.set('category', query.category);
    }
    if (query?.ordering) {
      params = params.set('ordering', query.ordering);
    }

    return this.http.get<HighJewelryItem[]>(`${this.baseUrl}jewelry/all`, {
      params
    });
  }

  getHighJewelryItem(id: number) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<HighJewelryItem>(`${this.baseUrl}jewelry`, { params });
  }

  createHighJewelryItem(payload: HighJewelryCreatePayload) {
    const headers = this.auth.getAuthHeaders();
    return this.http.post<HighJewelryItem>(`${this.baseUrl}jewelry`, payload, {
      headers
    });
  }

  // 👇 aquí mandamos item, item_id e image como espera el backend
  uploadImage(itemId: number, file: File, order: number) {
    const formData = new FormData();

    formData.append('item', itemId.toString());
    formData.append('item_id', itemId.toString());
    formData.append('order', order.toString());
    formData.append('image', file);

    const headers = this.auth.getAuthHeaders();
    return this.http.post(`${this.baseUrl}jewelry/images`, formData, {
      headers
    });
  }

  uploadImages(itemId: number, files: File[]) {
    const uploads = files.map((file, index) =>
      this.uploadImage(itemId, file, index)
    );
    return uploads;
  }

  fullImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) {
      return `${this.baseUrl.replace(/\/$/, '')}${path}`;
    }
    return `${this.baseUrl}${path}`;
  }
    updateHighJewelryItem(id: number, payload: HighJewelryCreatePayload) {
    const headers = this.auth.getAuthHeaders();
    const params = new HttpParams().set('id', id.toString());

    return this.http.put<HighJewelryItem>(`${this.baseUrl}jewelry`, payload, {
      headers,
      params
    });
  }

  deleteHighJewelryItem(id: number) {
    const headers = this.auth.getAuthHeaders();
    const params = new HttpParams().set('id', id.toString());

    return this.http.delete(`${this.baseUrl}jewelry`, {
      headers,
      params
    });
  }


}


