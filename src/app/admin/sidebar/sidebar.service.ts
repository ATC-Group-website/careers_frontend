import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private sidebarVisible: BehaviorSubject<boolean>;

  // Observable for components to subscribe to
  sidebarVisible$;

  constructor() {
    // Retrieve from localStorage or default to true
    const savedVisibility = localStorage.getItem('sidebarVisible');
    const initialVisibility =
      savedVisibility !== null ? JSON.parse(savedVisibility) : true;

    this.sidebarVisible = new BehaviorSubject<boolean>(initialVisibility);
    this.sidebarVisible$ = this.sidebarVisible.asObservable();
  }

  toggleSidebar() {
    const newVisibility = !this.sidebarVisible.value;
    this.sidebarVisible.next(newVisibility);
    // console.log('new value ' + newVisibility);

    // Save the updated visibility to localStorage
    localStorage.setItem('sidebarVisible', JSON.stringify(newVisibility));
  }

  closeSidebar() {
    this.sidebarVisible.next(false);
    localStorage.setItem('sidebarVisible', JSON.stringify(false));
  }

  openSidebar() {
    this.sidebarVisible.next(true);
    localStorage.setItem('sidebarVisible', JSON.stringify(true));
  }
}
