"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, History, Star, ChevronRight } from 'lucide-react';
import styles from './AccountSidebar.module.css';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Thông tin chung',
    href: '/tai-khoan',
    icon: <User size={20} />,
  },
  {
    label: 'Lịch sử giao dịch',
    href: '/tai-khoan/lich-su-giao-dich',
    icon: <History size={20} />,
  },
  {
    label: 'Galaxy Point',
    href: '/tai-khoan/galaxy-point',
    icon: <Star size={20} />,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.title}>Tài Khoản</h2>
      </div>
      <nav className={styles.nav}>
        {MENU_ITEMS.map((item) => {
          // Exact match for base /tai-khoan path, otherwise check if it's the current path or a child path
          const isActive = item.href === '/tai-khoan' 
            ? pathname === '/tai-khoan'
            : pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <div className={styles.navItemContent}>
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </div>
              <ChevronRight size={16} className={styles.chevron} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
