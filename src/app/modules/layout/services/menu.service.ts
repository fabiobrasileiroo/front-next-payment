import { Injectable, OnDestroy, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Menu } from 'src/app/core/constants/menu';
import { MenuItem, SubMenuItem } from 'src/app/core/models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements OnDestroy {
  private _showSidebar = signal(true);
  private _showMobileMenu = signal(false);
  private _pagesMenu = signal<MenuItem[]>([]);
  private _subscription = new Subscription();
  savedMenu: MenuItem[];

    constructor(private router: Router) {
    // Debug: Check what is in localStorage for 'menu'
       const savedMenuJson = localStorage.getItem('menu');
    this.savedMenu = savedMenuJson ? JSON.parse(savedMenuJson) : [];
    // this.savedMenu = Menu.getMenu();
    console.log("🚀 ~ MenuService ~ constructor ~ savedMenu:", this.savedMenu);

    /** Initialize the menu */
    if (this.savedMenu && this.savedMenu.length > 0) {
      this._pagesMenu.set(this.savedMenu); // Set menu from localStorage if available
      console.log("🚀 ~ MenuService ~ constructor ~ Menu loaded from local storage.");
    } else {
      this._pagesMenu.set(Menu.pages); // Fallback to default static menu
      console.log("🚀 ~ MenuService ~ constructor ~ Default menu loaded.");
      console.log("🚀 ~ MenuService ~ constructor ~ _pagesMenu:", this._pagesMenu)
    }

    // Subscribe to router events to update the menu based on navigation
    const sub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        /** Expand menu based on active route */
        this._pagesMenu().forEach((menu) => {
          let activeGroup = false;
          menu.items.forEach((subMenu) => {
            const active = this.isActive(subMenu.route);
            subMenu.expanded = active;
            subMenu.active = active;
            if (active) activeGroup = true;
            if (subMenu.children) {
              this.expand(subMenu.children);
            }
          });
          menu.active = activeGroup;
        });
      }
    });
    this._subscription.add(sub);
  }

  // Other methods remain unchanged...


  get showSideBar() {
    return this._showSidebar();
  }
  get showMobileMenu() {
    return this._showMobileMenu();
  }
  get pagesMenu() {
    return this._pagesMenu();
  }

  set showSideBar(value: boolean) {
    this._showSidebar.set(value);
  }
  set showMobileMenu(value: boolean) {
    this._showMobileMenu.set(value);
  }

  public toggleSidebar() {
    this._showSidebar.set(!this._showSidebar());
  }

  public toggleMenu(menu: any) {
    this.showSideBar = true;
    menu.expanded = !menu.expanded;
  }

  public toggleSubMenu(submenu: SubMenuItem) {
    submenu.expanded = !submenu.expanded;
  }

  public setMenu(menu: MenuItem[]) {
    this._pagesMenu.set(menu);
    Menu.setMenu(menu); // Update the static Menu class
  }

  private expand(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = this.isActive(item.route);
      if (item.children) this.expand(item.children);
    });
  }

  private isActive(instruction: any): boolean {
    return this.router.isActive(this.router.createUrlTree([instruction]), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
