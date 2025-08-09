import { ArrowLeft, Bell, Check, CreditCard, Download } from 'lucide-react';
import React, { useState } from 'react';
import SectionHeader from '../components/Settings/SectionHeader';
import SettingsCard from '../components/Settings/SettingsCard';
import SettingItem from '../components/Settings/SettingsItems';



const AdminSettingsPage: React.FC = () => {
    // State for notification preferences
    const [notifications, setNotifications] = useState({
        newOrders: true,
        bookingConfirmations: false,
        tableBookingRequests: true,
    });

    // State for data retention
    const [dataRetention, setDataRetention] = useState({
        orders: true,
        bookings: false,
    });

    const handleNotificationChange = (key: keyof typeof notifications) => (checked: boolean) => {
        setNotifications(prev => ({ ...prev, [key]: checked }));
    };

    const handleDataRetentionChange = (key: keyof typeof dataRetention) => (checked: boolean) => {
        setDataRetention(prev => ({ ...prev, [key]: checked }));
    };

    const handleDataDownload = () => {
        // Simulate data download
        console.log('Downloading data...');
    };

    return (
        <div className="min-h-screen bg-[var(--smoky-black-1)] text-[var(--white)]">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-[var(--smoky-black-1)] bg-opacity-95 backdrop-blur-md border-b border-[var(--eerie-black-4)]">
                <div className="flex items-center p-4 pb-3 justify-between max-w-4xl mx-auto">
                    <button className="text-[var(--white)] flex size-10 shrink-0 items-center justify-center hover:bg-[var(--eerie-black-4)] rounded-lg transition-colors duration-200">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg md:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
                        Settings
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 pt-5 pb-24 md:pb-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

                    {/* Stripe Settings */}
                    <section className="lg:col-span-2">
                        <SectionHeader title="Razor-Pay Settings" icon={<CreditCard size={24} />} />
                        <SettingsCard>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-[var(--white)] flex items-center justify-center rounded-xl bg-[var(--eerie-black-4)] shrink-0 size-14 md:size-16">
                                    <CreditCard size={28} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-[var(--white)] text-base md:text-lg font-semibold">
                                            Connected Razor-Pay Account
                                        </p>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                    {/* <p className="text-[var(--quick-silver)] text-sm">
                                        Account ID: acct_1234567890
                                    </p> */}
                                </div>
                            </div>
                            <button className="w-full bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-xl px-6 py-3 font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[0.98]">
                                Manage Razor-Pay Account
                            </button>
                        </SettingsCard>
                    </section>

                    {/* Notification Preferences */}
                    <section>
                        <SectionHeader title="Notification Preferences" icon={<Bell size={24} />} />
                        <SettingsCard>
                            <SettingItem
                                title="New Orders"
                                description="Push notifications for new orders"
                                type="toggle"
                                checked={notifications.newOrders}
                                onToggle={handleNotificationChange('newOrders')}
                                showBorder={true}
                            />
                            <SettingItem
                                title="Booking Confirmations"
                                description="Email notifications"
                                type="toggle"
                                checked={notifications.bookingConfirmations}
                                onToggle={handleNotificationChange('bookingConfirmations')}
                                showBorder={true}
                            />
                            <SettingItem
                                title="Table Booking Requests"
                                description="Push notifications for requests"
                                type="toggle"
                                checked={notifications.tableBookingRequests}
                                onToggle={handleNotificationChange('tableBookingRequests')}
                                showBorder={false}
                            />
                        </SettingsCard>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <SectionHeader title="Data Retention" />
                        <SettingsCard className="mb-6">
                            <SettingItem
                                title="Orders"
                                description="Automatically delete after 6 months"
                                type="toggle"
                                checked={dataRetention.orders}
                                onToggle={handleDataRetentionChange('orders')}
                                showBorder={true}
                            />
                            <SettingItem
                                title="Bookings"
                                description="Automatically delete after 12 months"
                                type="toggle"
                                checked={dataRetention.bookings}
                                onToggle={handleDataRetentionChange('bookings')}
                                showBorder={false}
                            />
                        </SettingsCard>

                        {/* Data Download */}
                        <SectionHeader title="Data Download" />
                        <SettingsCard>
                            <SettingItem
                                title="Download Data"
                                description="Export order and booking data (.csv)"
                                type="action"
                                onAction={handleDataDownload}
                                icon={<Download size={20} />}
                                showBorder={false}
                            />
                        </SettingsCard>
                    </section>
                </div>

                {/* Desktop Additional Settings */}
                <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
                    <section className="lg:col-span-2">
                        <SettingsCard className="bg-gradient-to-r from-[var(--eerie-black-2)] to-[var(--eerie-black-3)] border-[var(--gold-crayola)] border-opacity-20">
                            <div className="text-center py-4">
                                <div className="w-12 h-12 bg-[var(--gold-crayola)] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Check className="text-[var(--smoky-black-1)]" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--white)] mb-2">
                                    Settings Saved Successfully
                                </h3>
                                <p className="text-[var(--quick-silver)] text-sm">
                                    All your preferences have been automatically saved and applied.
                                </p>
                            </div>
                        </SettingsCard>
                    </section>
                </div>
            </main>

        </div>
    );
};

export default AdminSettingsPage;