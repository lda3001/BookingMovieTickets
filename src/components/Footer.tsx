import React from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.cols}>
                    <div>
                        <h3 className={styles.colTitle}>Giới thiệu</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="#">Về chúng tôi</Link></li>
                            <li><Link href="#">Thỏa thuận sử dụng</Link></li>
                            <li><Link href="#">Quy chế hoạt động</Link></li>
                            <li><Link href="#">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className={styles.colTitle}>Góc Điện Ảnh</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="#">Thể loại phim</Link></li>
                            <li><Link href="#">Bình luận phim</Link></li>
                            <li><Link href="#">Blog điện ảnh</Link></li>
                            <li><Link href="#">Phim hay tháng</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className={styles.colTitle}>Hỗ trợ</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="#">Góp ý</Link></li>
                            <li><Link href="#">Sale & Services</Link></li>
                            <li><Link href="#">Rạp / Giá vé</Link></li>
                            <li><Link href="#">Tuyển dụng</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className={styles.colTitle}>Kết nối Galaxy</h3>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialIcon}><Facebook /></a>
                            <a href="#" className={styles.socialIcon}><Youtube /></a>
                            <a href="#" className={styles.socialIcon}><Instagram /></a>
                            <a href="#" className={styles.socialIcon}><Twitter /></a>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            {/* Placeholder for Bo Cong Thuong or App Store badges */}
                            <div style={{ fontSize: 12, color: '#666', fontStyle: 'italic' }}>Galaxy Cinema App Available</div>
                        </div>
                    </div>
                </div>
                <div className={styles.copy}>
                    <p>&copy; 2025 Galaxy Studio. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
