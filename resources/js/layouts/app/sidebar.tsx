"use client"

import { Link, usePage } from "@inertiajs/react"
import {
    BarChart2,
    Receipt,
    Building2,
    CreditCard,
    Folder,
    Wallet,
    Users2,
    Shield,
    MessagesSquare,
    Video,
    Settings,
    HelpCircle,
    Menu,
    Search, Bell, Workflow, BarChart3, Users, Database, ArrowRight
} from "lucide-react"

import { Home } from "lucide-react"
import { useState } from "react"
import { type SharedData } from '@/types';
import { route } from 'ziggy-js';
import { useActiveRoute } from '@/utils/route-helpers';

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isActiveRoute, isActiveUrl } = useActiveRoute();

    function handleNavigation() {
        setIsMobileMenuOpen(false)
    }

    function NavItem({
        routeName,
        href,
        icon: Icon,
        children,
    }: {
        routeName?: string;
        href?: string;
        icon: any;
        children: React.ReactNode;
    }) {

        const isActive = routeName ? isActiveRoute(routeName) : (href ? isActiveUrl(href) : false);

        const linkHref = routeName ? route(routeName) : (href || '#');

        return (
            <Link
                href={linkHref}
                onClick={handleNavigation}
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
                <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                {children}
            </Link>
        )
    }


    const navigation = [
        { name: "Overview", href: "/dashboard", icon: Home },
        { name: "Workflows", href: "/workflows", icon: Workflow },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Templates", href: "/templates", icon: Database },
        { name: "Team", href: "/team", icon: Users },
        { name: "Settings", href: "/settings", icon: Settings },
    ]

    return (
        <>

            <nav
                className={`
                fixed inset-y-0 left-0 transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static bg-sidebar  h-full
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            >
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto py-4 px-4">
                        <div className="space-y-10">
                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Overview
                                </div>
                                <div className="space-y-2">
                                    {/*
                                        {navigation.map((item) => {
                                            const isActive = page.props.url === item.href;
                                            return (

                                                <NavItem icon={item.icon} key={item.name}
                                                    href={item.href}>
                                                    {item.name}
                                                </NavItem>
                                            )
                                        })}
                                    */}
                                    <NavItem href="/dashboard" icon={Home}>
                                        Dashboard
                                    </NavItem>
                                    <NavItem href="#" icon={Building2}>
                                        Organizações
                                    </NavItem>
                                    <NavItem href="#" icon={Folder}>
                                        Filiais
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Contabilidade
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="#" icon={CreditCard}>
                                        Plano de Contas
                                    </NavItem>
                                    <NavItem href="#" icon={Wallet}>
                                        Centro de Custo
                                    </NavItem>
                                    <NavItem href="#" icon={Receipt}>
                                        Unidades de Negócio
                                    </NavItem>
                                    <NavItem href="#" icon={CreditCard}>
                                        Lançamentos Contábeis
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Organização
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="#" icon={Users2}>
                                        Projetos
                                    </NavItem>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-4  dark:border-[#1F1F23]">
                        <div className="space-y-1">
                            <NavItem href="#" icon={Settings}>
                                Configurações
                            </NavItem>
                            <NavItem href="#" icon={HelpCircle}>
                                Ajuda
                            </NavItem>
                        </div>
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    )
}
