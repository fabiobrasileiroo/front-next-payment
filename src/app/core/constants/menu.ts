  // menu.ts
import { MenuItem } from '../models/menu.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Menu {
  public static pages: MenuItem[] = [];

  constructor() {
    const savedMenu = localStorage.getItem('menu');
    if (savedMenu) {
      Menu.pages = JSON.parse(savedMenu);
      console.log("🚀 ~ Menu ~ constructor ~ Menu loaded from localStorage:", Menu.pages);
    } else {
      console.log("🚀 ~ Menu ~ constructor ~ No menu found in localStorage.");
    }
  }

  static setMenu(menu: MenuItem[]) {
    Menu.pages = menu;
    localStorage.setItem('menu', JSON.stringify(menu));
    console.log("🚀 ~ Menu ~ setMenu ~ Menu updated in localStorage:", Menu.pages);
  }

  static getMenu(): MenuItem[] {
    return Menu.pages;
  }
}

  // public static pages: MenuItem[] = [
  //   {
  //     group: 'Products',
  //     separator: false,
  //     items: [
  //       {
  //         icon: 'assets/icons/heroicons/outline/cube.svg',
  //         label: 'Products',
  //         route: '/products',
  //         children: [
  //           { label: 'View Products', route: '/products/view' },
  //           { label: 'Categories', route: '/products/categories' },
  //           // Additional routes for admins only
  //           // { label: 'Add Product', route: '/products/add', adminOnly: true },
  //           // { label: 'Edit Product', route: '/products/edit', adminOnly: true },
  //           // { label: 'Delete Product', route: '/products/delete', adminOnly: true },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     group: 'Base',
  //     separator: false,
  //     items: [
  //     //   {
  //     //     icon: 'assets/icons/heroicons/outline/chart-pie.svg',
  //     //     label: 'Dashboard',
  //     //     route: '/dashboard',
  //     //     children: [
  //     //       { label: 'Nfts', route: '/dashboard/nfts' },
  //     //     ],
  //     //   },
  //       {
  //         icon: 'assets/icons/heroicons/outline/lock-closed.svg',
  //         label: 'Auth',
  //         route: '/auth',
  //         children: [
  //           { label: 'Sign up', route: '/auth/sign-up' },
  //           { label: 'Sign in', route: '/auth/sign-in' },
  //           { label: 'Forgot Password', route: '/auth/forgot-password' },
  //           { label: 'New Password', route: '/auth/new-password' },
  //           // { label: 'Two Steps', route: '/auth/two-steps' },
  //         ],
  //       },
  //     //   {
  //     //     icon: 'assets/icons/heroicons/outline/shield-exclamation.svg',
  //     //     label: 'Errors',
  //     //     route: '/errors',
  //     //     children: [
  //     //       { label: '404', route: '/errors/404' },
  //     //       { label: '500', route: '/errors/500' },
  //     //     ],
  //     //   },
  //     ],
  //   },
  //   {
  //     group: 'Collaboration',
  //     separator: true,
  //     items: [
  //       // {
  //       //   icon: 'assets/icons/heroicons/outline/download.svg',
  //       //   label: 'Download',
  //       //   route: '/download',
  //       // },
  //       // {
  //       //   icon: 'assets/icons/heroicons/outline/gift.svg',
  //       //   label: 'Gift Card',
  //       //   route: '/gift',
  //       // },
  //       {
  //         icon: 'assets/icons/heroicons/outline/users.svg',
  //         label: 'Users',
  //         route: '/users',
  //       },
  //     ],
  //   },
  //   {
  //     group: 'Config',
  //     separator: false,
  //     items: [
  //       {
  //         icon: 'assets/icons/heroicons/outline/cog.svg',
  //         label: 'Settings',
  //         route: '/settings',
  //       },
  //       // {
  //       //   icon: 'assets/icons/heroicons/outline/bell.svg',
  //       //   label: 'Notifications',
  //       //   route: '/notifications',
  //       // },
  //       // {
  //       //   icon: 'assets/icons/heroicons/outline/folder.svg',
  //       //   label: 'Folders',
  //       //   route: '/folders',
  //       //   children: [
  //       //     { label: 'Current Files', route: '/folders/current-files' },
  //       //     { label: 'Downloads', route: '/folders/download' },
  //       //     { label: 'Trash', route: '/folders/trash' },
  //       //   ],
  //       // },
  //     ],
  //   },
  // ];
// }
