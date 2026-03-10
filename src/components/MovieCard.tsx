import Link from 'next/link';
import { Ticket, Star, Clock } from 'lucide-react';
import styles from './MovieCard.module.css';

interface MovieProps {
    title: string;
    image: string;
    rating?: string;
    duration?: string;
    ageRating?: string;
    slug?: string;
}

export default function MovieCard({ title, image, rating, duration, slug, ageRating }: MovieProps) {
    const hasRating = rating && rating !== 'N/A' && parseFloat(rating) > 0;

    // Determine class for age rating
    let ageClass = styles.ageBadgeP;
    if (ageRating === 'T18') ageClass = styles.ageBadgeT18;
    else if (ageRating === 'T16') ageClass = styles.ageBadgeT16;
    else if (ageRating === 'T13') ageClass = styles.ageBadgeT13;
    else if (ageRating === 'K' || ageRating === 'P') ageClass = styles.ageBadgeP;
    function getUrlImg(image: string) {
        return image.startsWith('http') && image.startsWith('https') ? image : `http://localhost:8080/api${image}`;
    }

    return (
        <div className={styles.card}>
            <div className={styles.posterWrapper}>
                <img src={getUrlImg(image)} alt={title} className={styles.poster} />
                {hasRating && (
                    <div className={styles.ratingBadge}>
                        <Star size={14} fill="currentColor" />
                        <span>{rating}</span>
                    </div>
                )}
                {ageRating && (
                    <div className={`${styles.ageBadge} ${ageClass}`}>
                        {ageRating}
                    </div>
                )}
                <div className={styles.overlay}>
                    <Link href={`/dat-ve/${slug || '#'}`} className={styles.buyBtn}>
                        <Ticket size={18} />
                        <span>Mua vé</span>
                    </Link>
                </div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.title} title={title}>{title}</h3>
                <div className={styles.meta}>
                    {hasRating && (
                        <div className={styles.metaItem}>
                            <Star size={14} className={styles.metaIcon} />
                            <span>{rating}</span>
                        </div>
                    )}
                    {duration && (
                        <div className={styles.metaItem}>
                            <Clock size={14} className={styles.metaIcon} />
                            <span>{duration}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
