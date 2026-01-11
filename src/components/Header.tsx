"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, User, LogOut } from 'lucide-react';
import styles from './Header.module.css';
import LoginModal from './LoginModal';
import { authService } from '@/services/authService';

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
    const [user, setUser] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        // Kiểm tra user khi component mount và khi login thành công
        const checkUser = () => {
            const userData = authService.getUser();
            setUser(userData);
        };
        
        checkUser();
        
        // Lắng nghe sự kiện storage change để cập nhật khi login/logout từ tab khác
        const handleStorageChange = () => {
            checkUser();
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLoginSuccess = () => {
        const userData = authService.getUser();
        setUser(userData);
        setIsLoginOpen(false);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setShowUserMenu(false);
    };

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

                        {user ? (
                            <div 
                                className={styles.userMenu}
                                onMouseEnter={() => setShowUserMenu(true)}
                                onMouseLeave={() => setShowUserMenu(false)}
                            >
                                <div className={styles.userInfo}>
                                    <User size={18} />
                                    <span style={{ marginLeft: 8, fontSize: 14 }}>
                                        {user.fullName || user.email}
                                    </span>
                                </div>
                                <div className={`${styles.userDropdown} ${showUserMenu ? styles.userDropdownActive : ''}`}>
                                    <div className={styles.userDropdownItem}>
                                        <User size={16} />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className={styles.userDropdownDivider}></div>
                                    <Link href="/tai-khoan" className={styles.userDropdownItem}>
                                        <User size={16} />
                                        <span>Tài khoản của tôi</span>
                                    </Link>
                                    <div className={styles.userDropdownDivider}></div>
                                    <div 
                                        className={styles.userDropdownItem}
                                        onClick={handleLogout}
                                        style={{ cursor: 'pointer', color: '#ff4444' }}
                                    >
                                        <LogOut size={16} />
                                        <span>Đăng xuất</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={styles.loginBtn}
                                onClick={() => setIsLoginOpen(true)}
                            >
                                Đăng nhập
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
}
