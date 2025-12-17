import React from 'react';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import styles from './CinemaCorner.module.css';

// Mock Data
const BLOGS = [
    {
        id: 1,
        title: '[Preview] Avatar Fire And Ash: Một Tuyệt Tác Nữa Của James Cameron?',
        image: 'https://www.galaxycine.vn/media/2025/12/8/preview-avatar-fire-and-ash-mot-tuyet-tac-nua-cua-james-cameron-6_1765204784694.jpg',
        likes: 120,
        comments: 45
    },
    {
        id: 2,
        title: '[Review] Zootopia 2: Disney Thừa Biết Khán Giả Muốn Gì!',
        image: 'https://www.galaxycine.vn/media/2025/12/3/zootopia-2-disney-thua-biet-khan-gia-muon-gi-6_1764774408476.jpg',
        likes: 100,
        comments: 20
    },
    {
        id: 3,
        title: '[Review] Kung Fu Panda 4: Gấu Béo Tái Xuất, Lợi Hại Hơn Xưa?',
        image: 'https://cdn.galaxycine.vn/media/2024/3/8/kung-fu-panda-4-gau-beo-tai-xuat-loi-hai-hon-xua-1_1709886368383.jpg',
        likes: 210,
        comments: 56
    }
];

export default function CinemaCorner() {
    const featured = BLOGS[0];
    const sideItems = BLOGS.slice(1);

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Góc điện ảnh</h2>
                </div>

                <div className={styles.content}>

                    <div className={styles.featured}>
                        <div className={styles.featuredImageWrapper}>
                            <img src={featured.image} alt={featured.title} className={styles.image} />
                        </div>
                        <h3 className={styles.featuredTitle}>{featured.title}</h3>
                        <div className={styles.actions}>
                            <button className={styles.actionBtn}>
                                <ThumbsUp size={14} /> {featured.likes}
                            </button>
                            <button className={styles.actionBtn}>
                                <MessageCircle size={14} /> {featured.comments}
                            </button>
                        </div>
                        <p style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
                            Một sự kết hợp bùng nổ của hai quái thú huyền thoại...
                        </p>
                    </div>

                    <div className={styles.sideList}>
                        {sideItems.map(item => (
                            <div key={item.id} className={styles.sideItem}>
                                <div className={styles.sideImageWrapper}>
                                    <img src={item.image} alt={item.title} className={styles.image} />
                                </div>
                                <div className={styles.sideContent}>
                                    <h4 className={styles.sideTitle}>{item.title}</h4>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn}>
                                            <ThumbsUp size={12} /> {item.likes}
                                        </button>
                                        <button className={styles.actionBtn}>
                                            <MessageCircle size={12} /> {item.comments}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                <button className={styles.viewMoreBtn}>Xem thêm</button>
            </div>
        </section>
    );
}
