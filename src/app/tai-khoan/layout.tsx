"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountSidebar from '@/components/account/AccountSidebar';
import { authService } from '@/services/authService';
import styles from './layout.module.css';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to true after mount
    setIsClient(true);
    
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  // Always render the same structure on server and initial client render
  // to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className={styles.accountLayout}>
        <div className="container">
          <div className={styles.layoutContainer}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // After client-side hydration, check authentication
  if (!authService.isAuthenticated()) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={styles.accountLayout}>
      <div className="container">
        <div className={styles.layoutContainer}>
          <AccountSidebar />
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
