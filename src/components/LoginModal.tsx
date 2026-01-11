"use client";

import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import styles from './LoginModal.module.css';
import { authService } from '@/services/authService';
import { LoginRequest, RegisterRequest } from '@/types/api';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setPhone('');
        setDateOfBirth('');
        setError(null);
    };

    const handleSwitchMode = () => {
        setIsRegister(!isRegister);
        resetForm();
    };

    const formatDateForBackend = (dateStr: string): string => {
        if (!dateStr) return '';
        // Convert from YYYY-MM-DD to dd/MM/yyyy
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegister) {
                // Validation cho đăng ký
                if (!email || !password) {
                    setError('Vui lòng điền đầy đủ email và mật khẩu');
                    setLoading(false);
                    return;
                }

                if (password.length < 6) {
                    setError('Mật khẩu phải có ít nhất 6 ký tự');
                    setLoading(false);
                    return;
                }

                if (password !== confirmPassword) {
                    setError('Mật khẩu xác nhận không khớp');
                    setLoading(false);
                    return;
                }

                const registerData: RegisterRequest = {
                    email,
                    password,
                    fullName: fullName || undefined,
                    phone: phone || undefined,
                    dateOfBirth: dateOfBirth ? formatDateForBackend(dateOfBirth) : undefined,
                };

                const response = await authService.register(registerData);
                authService.saveToken(response.token);
                authService.saveUser({
                    userId: response.userId,
                    email: response.email,
                    fullName: response.fullName,
                    role: response.role,
                    phone: response.phone,
                    dateOfBirth: response.dateOfBirth,
                });

                resetForm();
                onLoginSuccess?.();
                onClose();
            } else {
                // Đăng nhập
                if (!email || !password) {
                    setError('Vui lòng điền đầy đủ email và mật khẩu');
                    setLoading(false);
                    return;
                }

                const loginData: LoginRequest = {
                    email,
                    password,
                };

                const response = await authService.login(loginData);
                authService.saveToken(response.token);
                authService.saveUser({
                    userId: response.userId,
                    email: response.email,
                    fullName: response.fullName,
                    phone: response.phone,
                    dateOfBirth: response.dateOfBirth,
                    role: response.role,
                });

                resetForm();
                onLoginSuccess?.();
                onClose();
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

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
                    {error && (
                        <div style={{
                            padding: '12px',
                            marginBottom: '16px',
                            backgroundColor: '#fee',
                            color: '#c33',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="text"
                                        placeholder="Họ và Tên"
                                        className={styles.input}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="tel"
                                        placeholder="Số điện thoại"
                                        className={styles.input}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="date"
                                        placeholder="Ngày sinh"
                                        className={styles.input}
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Email"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mật khẩu"
                                    className={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {!isRegister && <a href="#" className={styles.forgotPassword}>Quên mật khẩu?</a>}

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : (isRegister ? 'Hoàn tất' : 'Đăng nhập')}
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
                            onClick={handleSwitchMode}
                        >
                            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
