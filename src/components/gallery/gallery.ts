import { Component } from '@angular/core';

interface NailSet {
  id: number; label: string; style: string;
  color: string; tag: string; img: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css']
})
export class Gallery {
  activeFilter = 'All';
  filters = ['All', 'Tipo 1', 'Tipo 2', 'Tipo 3'];

  sets: NailSet[] = [
    {
      id: 1,
      label: 'Example 1',
      style: 'Soft Glam',
      color: 'linear-gradient(135deg,#fde8f0,#f7c0d8)',
      tag: 'Tipo 1',
      img: 'https://i.postimg.cc/3rpWpD8k/Snap-Insta-to-670927879-18092403655975839-1683761925256477831-n.webp'
    },
    {
      id: 2,
      label: 'Example 2',
      style: 'Floral',
      color: 'linear-gradient(135deg,#f7c0d8,#e8a4b8)',
      tag: 'Tipo 2',
      img: 'https://i.postimg.cc/zDW3WRzL/Snap-Insta-to-670959238-18092403634975839-4641317102916425429-n.webp'
    },
  ];

  selectedImage: NailSet | null = null;

  openLightbox(item: NailSet) {
    console.log('Selected image:', item);
    this.selectedImage = item;
  }
  isMobile(): boolean {
    return window.matchMedia('(max-width: 768px)').matches;
  }
  closeLightbox() {
    console.log('Lightbox closed');
    this.selectedImage = null;
  }

  get filtered(): NailSet[] {
    return this.activeFilter === 'All' ? this.sets : this.sets.filter(s => s.tag === this.activeFilter);
  }
}