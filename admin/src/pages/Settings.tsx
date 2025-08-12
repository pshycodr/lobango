'use client'

import { ArrowLeft, Check, CreditCard, Download } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import SectionHeader from '../components/Settings/SectionHeader'
import SettingsCard from '../components/Settings/SettingsCard'
import SettingItem from '../components/Settings/SettingsItems'
import { usePermissionsStore } from '../store/zustand/usePermissionsStore'

const AdminSettingsPage: React.FC = () => {
    const {
        fetchPermissions,
        newBookings,
        newOrders,
        setNewBookingPermission,
        setNewOrderPermission,
        loading: permsLoading,
    } = usePermissionsStore()

    const [dataRetention, setDataRetention] = useState({
        orders: false,
        bookings: false,
    })

    const [updating, setUpdating] = useState({
        orders: false,
        bookings: false,
    })

    useEffect(() => {
        fetchPermissions()
    }, [fetchPermissions])

    useEffect(() => {
        setDataRetention({
            orders: !!newOrders,
            bookings: !!newBookings,
        })
    }, [newOrders, newBookings])

    const handleDataRetentionChange =
        (key: keyof typeof dataRetention) => async (checked: boolean) => {
            setDataRetention((prev) => ({ ...prev, [key]: checked }))
            if (key === 'orders') {
                setUpdating((s) => ({ ...s, orders: true }))
                try {
                    await setNewOrderPermission(checked)
                } catch (e) {
                    setDataRetention((prev) => ({ ...prev, orders: !!newOrders }))
                } finally {
                    setUpdating((s) => ({ ...s, orders: false }))
                }
            } else {
                setUpdating((s) => ({ ...s, bookings: true }))
                try {
                    await setNewBookingPermission(checked)
                } catch (e) {
                    setDataRetention((prev) => ({ ...prev, bookings: !!newBookings }))
                } finally {
                    setUpdating((s) => ({ ...s, bookings: false }))
                }
            }
        }

    const handleDataDownload = () => {
        console.log('Downloading data...')
    }

    return (
        <div className="min-h-screen bg-[var(--smoky-black-1)] text-[var(--white)]">
            <header className="sticky top-0 z-40 bg-[var(--smoky-black-1)] bg-opacity-95 backdrop-blur-md border-b border-[var(--eerie-black-4)]">
                <div className="flex items-center p-4 pb-3 justify-between max-w-4xl mx-auto">
                    {/* <button className="text-[var(--white)] flex size-10 shrink-0 items-center justify-center hover:bg-[var(--eerie-black-4)] rounded-lg transition-colors duration-200">
                        <ArrowLeft size={20} />
                    </button> */}
                    <h1 className="text-lg md:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">
                        Settings
                    </h1>
                </div>
            </header>

            <main className="flex-1 px-4 pt-5 pb-24 md:pb-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    </div>
                                </div>
                            </div>
                            <button className="w-full bg-[var(--gold-crayola)] text-[var(--smoky-black-1)] rounded-xl px-6 py-3 font-semibold hover:bg-opacity-90 transition-all duration-200 transform hover:scale-[0.98]">
                                Manage Razor-Pay Account
                            </button>
                        </SettingsCard>
                    </section>

                    <section>
                        <SectionHeader title="Toggle Permissions" />
                        <SettingsCard className="mb-6">
                            <SettingItem
                                title="Orders"
                                description="Automatically accept new orders"
                                type="toggle"
                                checked={dataRetention.orders}
                                onToggle={handleDataRetentionChange('orders')}
                                showBorder={true}
                                loading={permsLoading || updating.orders}
                            />
                            <SettingItem
                                title="Bookings"
                                description="Automatically accept new table bookings"
                                type="toggle"
                                checked={dataRetention.bookings}
                                onToggle={handleDataRetentionChange('bookings')}
                                showBorder={false}
                                loading={permsLoading || updating.bookings}
                            />
                        </SettingsCard>
                    </section>
                    <section>
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

                <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
                    <section className="lg:col-span-2">
                        <SettingsCard className="bg-gradient-to-r from-[var(--eerie-black-2)] to-[var(--eerie-black-3)] border-[var(--gold-crayola)] border-opacity-20">
                            <div className="text-center py-4">
                                <div className="w-12 h-12 bg-[var(--gold-crayola)] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Check className="text-[var(--smoky-black-1)]" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--white)] mb-2">Settings Saved Successfully</h3>
                                <p className="text-[var(--quick-silver)] text-sm">
                                    All your preferences have been automatically saved and applied.
                                </p>
                            </div>
                        </SettingsCard>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default AdminSettingsPage