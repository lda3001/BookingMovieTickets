"use client";

import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';
import LoginModal from './LoginModal';

const NAV_ITEMS = [
    { label: 'Mua vé', href: '#' }, // No submenu
    {
        label: 'Phim',
        href: '#',
        subMenu: [
            { label: 'Phim Đang Chiếu', href: '#' },
            { label: 'Phim Sắp Chiếu', href: '#' },
        ]
    },
    {
        label: 'Góc Điện Ảnh',
        href: '#',
        subMenu: [
            { label: 'Bình Luận Phim', href: '#' },
            { label: 'Blog Điện Ảnh', href: '#' },
            { label: 'Phim Hay Tháng', href: '#' },
        ]
    },
    {
        label: 'Sự Kiện',
        href: '#',
        subMenu: [
            { label: 'Ưu Đãi', href: '#' },
            { label: 'Phim Hay Tháng', href: '#' },
        ]
    },
    {
        label: 'Rạp/Giá Vé',
        href: '#',
        subMenu: [
            { label: 'Rạp Galaxy', href: '#' },
            { label: 'Giá Vé', href: '#' },
        ]
    },
];

export default function Header() {
    const [isLoginOpen, setIsLoginOpen] = React.useState(false);
    const [activeSubMenu, setActiveSubMenu] = React.useState<string | null>(null);

    return (
        <>
            <header className={styles.header}>
                <div className={`container ${styles.limitContainer}`}>
                    <Link href="/" className={styles.logo}>
                        <img
                            src="https://www.galaxycine.vn/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fgalaxy-logo-mobile.074abeac.png&w=128&q=75"
                            alt="Galaxy Cinema"
                            width={120}
                            height={40}
                            style={{ objectFit: 'contain' }}
                        />
                    </Link>

                    <nav className={styles.nav}>
                        {NAV_ITEMS.map((item) => (
                            <div 
                                key={item.label} 
                                className={styles.navItemWrapper}
                                onMouseEnter={() => item.subMenu && setActiveSubMenu(item.label)}
                                onMouseLeave={() => setActiveSubMenu(null)}
                            >
                                <Link href={item.href} className={styles.navItem}>
                                    {item.label}
                                    {item.subMenu && (
                                        <ChevronDown 
                                            size={16} 
                                            className={`${styles.chevron} ${activeSubMenu === item.label ? styles.chevronActive : ''}`}
                                        />
                                    )}
                                </Link>
                                {item.subMenu && (
                                    <div className={`${styles.dropdown} ${activeSubMenu === item.label ? styles.dropdownActive : ''}`}>
                                        {item.subMenu.map(sub => (
                                            <Link 
                                                key={sub.label} 
                                                href={sub.href} 
                                                className={styles.subItem}
                                                onClick={() => setActiveSubMenu(null)}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className={styles.actions}>
                        <div className={styles.searchWrapper}>
                            <Search size={20} />
                            <span style={{ marginLeft: 8, fontSize: 14 }}>Tìm kiếm</span>
                        </div>

                        <div className={styles.separator}></div>

                        <div
                            className={styles.loginBtn}
                            onClick={() => setIsLoginOpen(true)}
                        >
                            Đăng nhập
                        </div>
                    </div>
                </div>
            </header>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </>
    );
}
