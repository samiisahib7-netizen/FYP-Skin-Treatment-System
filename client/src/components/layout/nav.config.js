/**
 * Role-aware navigation config.
 * Each role has its own list of sidebar links.
 */
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Pill,
  ShoppingBag,
  Receipt,
  Users,
  Stethoscope,
  Package,
  Truck,
  BarChart3,
  Bell,
  Star,
} from 'lucide-react';

const NAV = {
  patient: [
    { to: '/patient', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/patient/appointments', label: 'My Appointments', icon: Calendar },
    { to: '/patient/prescriptions', label: 'Prescriptions', icon: Pill },
    { to: '/patient/reports', label: 'Medical Reports', icon: FileText },
    { to: '/patient/store', label: 'Shop', icon: Package },
    { to: '/patient/orders', label: 'My Orders', icon: ShoppingBag },
    { to: '/patient/notifications', label: 'Notifications', icon: Bell },
  ],
  doctor: [
    { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    { to: '/doctor/patients', label: 'Patients', icon: Users },
    { to: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
    { to: '/doctor/notifications', label: 'Notifications', icon: Bell },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/admin/patients', label: 'Patients', icon: Users },
    { to: '/admin/riders', label: 'Riders', icon: Truck },
    { to: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ],
  rider: [
    { to: '/rider', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/rider/deliveries', label: 'My Deliveries', icon: Truck },
    { to: '/rider/history', label: 'History', icon: Receipt },
  ],
};

export function getNavForRole(role) {
  return NAV[role] || [];
}
