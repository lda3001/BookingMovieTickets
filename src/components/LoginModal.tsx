"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import styles from './LoginModal.module.css';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.body}>
                    <form onSubmit={e => e.preventDefault()}>

                        {isRegister && (
                            <>
                                <div className={styles.inputGroup}>
                                    <input type="text" placeholder="Họ và Tên" className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <input type="tel" placeholder="Số điện thoại" className={styles.input} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <input type="date" placeholder="Ngày sinh" className={styles.input} />
                                </div>
                                <div className={styles.inputGroup} style={{ display: 'flex', gap: 20 }}>
                                    <label style={{ fontSize: 14 }}><input type="radio" name="gender" value="nam" /> Nam</label>
                                    <label style={{ fontSize: 14 }}><input type="radio" name="gender" value="nu" /> Nữ</label>
                                </div>
                            </>
                        )}

                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Email"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mật khẩu"
                                    className={styles.input}
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {isRegister && (
                            <div className={styles.inputGroup}>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        type="password"
                                        placeholder="Xác nhận mật khẩu"
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        )}

                        {!isRegister && <a href="#" className={styles.forgotPassword}>Quên mật khẩu?</a>}

                        <button type="submit" className={styles.submitBtn}>
                            {isRegister ? 'Hoàn tất' : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className={styles.divider}>
                        <span>Hoặc sử dụng</span>
                    </div>

                    <div className={styles.socialButtons}>
                        <button className={styles.socialBtn}>
                            Facebook
                        </button>
                        <button className={styles.socialBtn}>
                            Google
                        </button>
                    </div>

                    <div className={styles.footer}>
                        {isRegister ? 'Bạn đã có tài khoản? ' : 'Bạn chưa có tài khoản? '}
                        <span
                            className={styles.registerLink}
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
