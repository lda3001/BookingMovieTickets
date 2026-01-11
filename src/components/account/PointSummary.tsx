"use client";

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Gift, Award } from 'lucide-react';
import { authService } from '@/services/authService';
import styles from './PointSummary.module.css';

interface MembershipLevel {
  name: string;
  minPoints: number;
  maxPoints: number | null;
  color: string;
  benefits: string[];
}

const MEMBERSHIP_LEVELS: MembershipLevel[] = [
  {
    name: 'Star',
    minPoints: 0,
    maxPoints: 999,
    color: '#94a3b8',
    benefits: [
      'Tích điểm mỗi giao dịch',
      'Nhận thông tin ưu đãi qua email',
      'Sinh nhật tặng voucher 50.000đ',
    ],
  },
  {
    name: 'G-Star',
    minPoints: 1000,
    maxPoints: 4999,
    color: '#f59e0b',
    benefits: [
      'Tất cả quyền lợi Star',
      'Giảm 10% combo bắp nước',
      'Ưu tiên đặt vé sớm',
      'Sinh nhật tặng voucher 100.000đ',
    ],
  },
  {
    name: 'X-Star',
    minPoints: 5000,
    maxPoints: null,
    color: '#f58020',
    benefits: [
      'Tất cả quyền lợi G-Star',
      'Giảm 15% combo bắp nước',
      'Miễn phí nâng cấp ghế VIP',
      'Tặng vé xem phim sinh nhật',
      'Ưu tiên chăm sóc khách hàng',
    ],
  },
];

export default function PointSummary() {
  const [points, setPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<MembershipLevel>(MEMBERSHIP_LEVELS[0]);
  const [nextLevel, setNextLevel] = useState<MembershipLevel | null>(MEMBERSHIP_LEVELS[1]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadUserPoints();
  }, []);

  const loadUserPoints = () => {
    // TODO: Replace with actual API call when backend is ready
    const user = authService.getUser();
    const userPoints = user?.points || 0;
    
    setPoints(userPoints);
    
    // Determine current level
    const level = MEMBERSHIP_LEVELS.find(
      (l) => userPoints >= l.minPoints && (l.maxPoints === null || userPoints <= l.maxPoints)
    ) || MEMBERSHIP_LEVELS[0];
    
    setCurrentLevel(level);
    
    // Determine next level
    const currentIndex = MEMBERSHIP_LEVELS.indexOf(level);
    const next = currentIndex < MEMBERSHIP_LEVELS.length - 1 
      ? MEMBERSHIP_LEVELS[currentIndex + 1] 
      : null;
    
    setNextLevel(next);
    
    // Calculate progress
    if (next) {
      const pointsInCurrentLevel = userPoints - level.minPoints;
      const pointsNeededForNextLevel = next.minPoints - level.minPoints;
      const progressPercent = (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
      setProgress(Math.min(progressPercent, 100));
    } else {
      setProgress(100); // Max level reached
    }
  };

  const formatPoints = (pts: number): string => {
    return new Intl.NumberFormat('vi-VN').format(pts);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Galaxy Point</h1>
      </div>

      {/* Current Points Card */}
      <div className={styles.pointsCard} style={{ borderColor: currentLevel.color }}>
        <div className={styles.pointsHeader}>
          <div className={styles.levelBadge} style={{ backgroundColor: currentLevel.color }}>
            <Award size={24} />
            <span>{currentLevel.name}</span>
          </div>
          <div className={styles.pointsDisplay}>
            <Star size={32} fill={currentLevel.color} color={currentLevel.color} />
            <div>
              <div className={styles.pointsValue}>{formatPoints(points)}</div>
              <div className={styles.pointsLabel}>điểm</div>
            </div>
          </div>
        </div>

        {nextLevel && (
          <div className={styles.progressSection}>
            <div className={styles.progressInfo}>
              <span>Tiến độ đến {nextLevel.name}</span>
              <span className={styles.pointsNeeded}>
                Còn {formatPoints(nextLevel.minPoints - points)} điểm
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: currentLevel.color 
                }}
              ></div>
            </div>
          </div>
        )}

        {!nextLevel && (
          <div className={styles.maxLevel}>
            <TrendingUp size={20} />
            <span>Bạn đã đạt cấp độ cao nhất!</span>
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className={styles.benefitsSection}>
        <h2 className={styles.sectionTitle}>
          <Gift size={20} />
          Quyền lợi hiện tại
        </h2>
        <ul className={styles.benefitsList}>
          {currentLevel.benefits.map((benefit, index) => (
            <li key={index} className={styles.benefitItem}>
              <div className={styles.benefitIcon} style={{ backgroundColor: currentLevel.color }}>
                ✓
              </div>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* All Levels Overview */}
      <div className={styles.levelsSection}>
        <h2 className={styles.sectionTitle}>Các hạng thành viên</h2>
        <div className={styles.levelsList}>
          {MEMBERSHIP_LEVELS.map((level) => (
            <div 
              key={level.name} 
              className={`${styles.levelCard} ${level.name === currentLevel.name ? styles.currentLevelCard : ''}`}
              style={{ borderColor: level.color }}
            >
              <div className={styles.levelCardHeader} style={{ backgroundColor: level.color }}>
                <Award size={20} />
                <span className={styles.levelName}>{level.name}</span>
              </div>
              <div className={styles.levelCardBody}>
                <div className={styles.levelRange}>
                  {formatPoints(level.minPoints)} - {level.maxPoints ? formatPoints(level.maxPoints) : '∞'} điểm
                </div>
                <ul className={styles.levelBenefits}>
                  {level.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to Earn Points */}
      <div className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Cách tích điểm</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🎬</div>
            <div className={styles.infoContent}>
              <h3>Mua vé xem phim</h3>
              <p>1 điểm cho mỗi 1.000đ chi tiêu</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🍿</div>
            <div className={styles.infoContent}>
              <h3>Mua combo bắp nước</h3>
              <p>1 điểm cho mỗi 1.000đ chi tiêu</p>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🎁</div>
            <div className={styles.infoContent}>
              <h3>Sự kiện đặc biệt</h3>
              <p>Nhận điểm thưởng từ các chương trình khuyến mãi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
