"use client";

import { motion } from "motion/react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Calendar, DollarSign, Eye, MapPin, Package, Palette, TrendingUp, Users } from "lucide-react";

const revenueData = [
    { month: "Jan", revenue: 12400 },
    { month: "Feb", revenue: 15200 },
    { month: "Mar", revenue: 18100 },
    { month: "Apr", revenue: 16800 },
    { month: "May", revenue: 21000 },
    { month: "Jun", revenue: 25400 },
];

const recentBookings = [
    { id: "BK-2045", customer: "John Smith", tour: "K2 Base Camp Trek", amount: "$2,500", status: "confirmed" },
    { id: "BK-2044", customer: "Sarah Wilson", tour: "Hunza Valley Tour", amount: "$1,800", status: "pending" },
    { id: "BK-2043", customer: "Mike Johnson", tour: "Swat Valley Trip", amount: "$1,200", status: "confirmed" },
];

const stats = [
    {
        label: "Total Revenue",
        value: "$124,500",
        change: "+12.5%",
        icon: DollarSign,
        iconWrapClass: "bg-emerald-50",
        iconClass: "text-emerald-600",
    },
    {
        label: "Active Tours",
        value: "24",
        change: "+3",
        icon: MapPin,
        iconWrapClass: "bg-blue-50",
        iconClass: "text-blue-600",
    },
    {
        label: "Total Bookings",
        value: "342",
        change: "+18.2%",
        icon: Calendar,
        iconWrapClass: "bg-purple-50",
        iconClass: "text-purple-600",
    },
    {
        label: "Total Customers",
        value: "1,847",
        change: "+24",
        icon: Users,
        iconWrapClass: "bg-orange-50",
        iconClass: "text-orange-600",
    },
];

const quickActions = [
    {
        title: "Manage Tours",
        description: "Add, edit, or remove your tour packages",
        action: "Go to Tours",
        icon: MapPin,
        cardClass: "from-blue-500 to-blue-600",
        textClass: "text-blue-100",
        buttonClass: "text-blue-600 hover:bg-blue-50",
    },
    {
        title: "Edit Website",
        description: "Customize your agency website design",
        action: "Open Builder",
        icon: Package,
        cardClass: "from-purple-500 to-purple-600",
        textClass: "text-purple-100",
        buttonClass: "text-purple-600 hover:bg-purple-50",
    },
    {
        title: "Change Theme",
        description: "Browse and apply beautiful themes",
        action: "Browse Themes",
        icon: Palette,
        cardClass: "from-green-500 to-green-600",
        textClass: "text-green-100",
        buttonClass: "text-green-600 hover:bg-green-50",

    },
];


const DashboardHomePage = () => {
    return (
        <main className="p-3 sm:p-4 md:p-6 xl:p-8">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 xl:gap-6 mb-6 md:mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="bg-white rounded-md p-4 md:p-5 xl:p-6 hover:shadow-lg transition-all border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-11 h-11 md:w-12 md:h-12 rounded-md flex items-center justify-center ${stat.iconWrapClass}`}>
                                    <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconClass}`} />
                                </div>
                                <span className="text-xs sm:text-sm text-emerald-600 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    {stat.change}
                                </span>
                            </div>
                            <div className="text-2xl md:text-3xl mb-1 font-heading">{stat.value}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-md p-4 md:p-5 xl:p-6 border border-slate-100">
                        <h3 className="text-base sm:text-lg mb-4 font-heading">Revenue Overview</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#003b95" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#003b95" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#003b95" strokeWidth={2} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-md p-4 md:p-5 xl:p-6 border border-slate-100">
                        <h3 className="text-base sm:text-lg mb-4 font-heading">Booking Trends</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-md p-4 md:p-5 xl:p-6 border border-slate-100">
                    <div className="flex items-center justify-between mb-5 sm:mb-6 gap-4">
                        <h3 className="text-base sm:text-lg font-heading">Recent Bookings</h3>
                        <button className="text-xs sm:text-sm text-primary-600 hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px]">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-medium text-gray-600">ID</th>
                                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-medium text-gray-600">Customer</th>
                                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-medium text-gray-600">Tour</th>
                                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-medium text-gray-600">Amount</th>
                                    <th className="text-left py-3 px-4 text-xs sm:text-sm font-medium text-gray-600">Status</th>
                                    <th className="text-right py-3 px-4 text-xs sm:text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBookings.map((booking) => (
                                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-mono text-xs sm:text-sm">{booking.id}</td>
                                        <td className="py-3 px-4 text-sm">{booking.customer}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{booking.tour}</td>
                                        <td className="py-3 px-4 text-sm font-medium">{booking.amount}</td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 rounded-md text-xs ${booking.status === "confirmed"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-amber-50 text-amber-600"
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button className="p-2 hover:bg-gray-100 rounded-md">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 xl:gap-6">
                    {quickActions.map((item) => (
                        <div
                            key={item.title}
                            className={`bg-gradient-to-br ${item.cardClass} rounded-md p-5 md:p-6 text-white`}
                        >
                            <item.icon className="w-8 h-8 mb-3 opacity-80" />
                            <h4 className="text-lg mb-2 font-heading">{item.title}</h4>
                            <p className={`text-sm mb-4 ${item.textClass}`}>{item.description}</p>
                            <button className={`px-4 py-2 bg-white rounded-md text-sm transition-colors ${item.buttonClass}`}>
                                {item.action}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default DashboardHomePage;
