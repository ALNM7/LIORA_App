import { NavBarComponent } from '../../partials/nav-bar/nav-bar.component';
import { FooterComponent } from '../../partials/footer/footer.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  JewelryService,
  HighJewelryCreatePayload,
  HighJewelryItem
} from '../../services/jewelry.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-high-j-new',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, FooterComponent],
  templateUrl: './admin-high-j-new.component.html',
  styleUrls: ['./admin-high-j-new.component.scss']
})
export class AdminHighJNewComponent implements OnInit {
  name = '';
  category = 'bracelet';
  materials = '';
  price: number | null = null;
  is_active = true;

  files: File[] = [];
  saving = false;
  message = '';
  authReady = false;

  
  isUpdate = false;
  editingId: number | null = null;

  constructor(
    //helpers 
    private jewelryService: JewelryService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private location: Location   
  ) {}

  ngOnInit(): void {
    
    //this is what the page is going to load first
    if (!this.auth.getToken()) {
      this.message = 'Please sign in as Liora admin to create or edit pieces.';
      return;
    }
    this.authReady = true;

    // if id comes in the url then is for update
    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isUpdate = true;
        this.editingId = id;
        this.loadForEdit(id);
      }
    }
  }

  loadForEdit(id: number): void {
    this.jewelryService.getHighJewelryItem(id).subscribe({
      next: (item: HighJewelryItem) => {
        this.name = item.name;
        this.category = item.category;
        this.materials = item.materials;
        this.price = item.price;
        this.is_active = item.is_active;
      },
      error: (err) => {
        console.error(err);
        this.message = 'Could not load piece for editing.';
      }
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.files = Array.from(input.files);
  }

  onSubmit(): void {
    if (!this.auth.getToken()) {
      this.message = 'Not authenticated. Cannot save item.';
      return;
    }

    if (!this.name || !this.materials || this.price == null) {
      this.message = 'Please fill all required fields.';
      return;
    }

    const payload: HighJewelryCreatePayload = {
      name: this.name,
      category: this.category,
      materials: this.materials,
      price: this.price,
      is_active: this.is_active
    };

    this.saving = true;
    this.message = '';

    if (this.isUpdate && this.editingId != null) {
      // UPDATE!!!!
      this.jewelryService.updateHighJewelryItem(this.editingId, payload).subscribe({
        next: (updated) => {
          if (this.files.length > 0) {
            this.uploadImagesSequential(updated.id, this.files, 0);
          } else {
            this.finishSuccess(true);
          }
        },
        error: (err) => {
          console.error(err);
          this.message = 'Error updating item.';
          this.saving = false;
        }
      });
    } else {
      // CREATE
      this.jewelryService.createHighJewelryItem(payload).subscribe({
        next: (created) => {
          if (this.files.length > 0) {
            this.uploadImagesSequential(created.id, this.files, 0);
          } else {
            this.finishSuccess(false);
          }
        },
        error: (err) => {
          console.error(err);
          this.message = 'Error creating item.';
          this.saving = false;
        }
      });
    }
  }

  private uploadImagesSequential(itemId: number, files: File[], index: number): void {
    if (index >= files.length) {
      this.finishSuccess(this.isUpdate);
      return;
    }

    this.jewelryService.uploadImage(itemId, files[index], index).subscribe({
      next: () => {
        this.uploadImagesSequential(itemId, files, index + 1);
      },
      error: (err) => {
        console.error('Error uploading image', err);
        this.uploadImagesSequential(itemId, files, index + 1);
      }
    });
  }

  private finishSuccess(isUpdate: boolean): void {
    this.message = isUpdate
      ? 'Piece updated successfully.'
      : 'High jewelry piece created successfully.';

    this.saving = false;

   
    if (!isUpdate) {
      this.name = '';
      this.category = 'bracelet';
      this.materials = '';
      this.price = null;
      this.is_active = true;
      this.files = [];
    }

    
    this.location.back();
  }
}
