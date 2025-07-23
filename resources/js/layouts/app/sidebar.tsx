"use client"

import { Link } from "@inertiajs/react"
import {
    Receipt,
    Building2,
    CreditCard,
    Folder,
    Wallet,
    Users2,
    Settings,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    FolderOpen,
    Calendar,
    Target,
    Clock,
    BaggageClaim,
    HandCoins,
    Truck,
    ShoppingCart,
    ShoppingBag
} from "lucide-react"

import { Home } from "lucide-react"
import { useState } from "react"

import { route } from 'ziggy-js';
import { useActiveRoute } from '@/utils/route-helpers';

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const { isActiveRoute, isActiveUrl } = useActiveRoute();

    function handleNavigation() {
        setIsMobileMenuOpen(false)
    }

    function toggleExpanded(itemId: string) {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
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
                className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
            >
                <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                {children}
            </Link>
        )
    }

    function CollapsibleNavItem({
        id,
        icon: Icon,
        children,
        subItems,
    }: {
        id: string;
        icon: any;
        children: React.ReactNode;
        subItems: Array<{
            routeName?: string;
            href?: string;
            icon: unknown;
            label: string;
        }>;
    }) {
        const isExpanded = expandedItems.includes(id);
        const ChevronIcon = isExpanded ? ChevronDown : ChevronRight;

        return (
            <div>
                <button
                    onClick={() => toggleExpanded(id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                        {children}
                    </div>
                    <ChevronIcon className="h-4 w-4 transition-transform duration-200" />
                </button>

                {isExpanded && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-sidebar-border pl-3">
                        {subItems.map((item, index) => {
                            const isActive = item.routeName ? isActiveRoute(item.routeName) : (item.href ? isActiveUrl(item.href) : false);
                            const linkHref = item.routeName ? route(item.routeName) : (item.href || '#');

                            return (
                                <Link
                                    key={index}
                                    href={linkHref}
                                    onClick={handleNavigation}
                                    className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${isActive
                                        ? "bg-sidebar-accent text-sidebar-muted-foreground font-medium"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                        }`}
                                >
                                    <item.icon className="h-3.5 w-3.5 mr-3 flex-shrink-0" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        )
    }




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
                                    <NavItem href="/organizations" icon={Building2}>
                                        Organizações
                                    </NavItem>
                                    <NavItem href="/branches" icon={Folder}>
                                        Filiais
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Contabilidade
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/chart-accounts" icon={CreditCard}>
                                        Plano de Contas
                                    </NavItem>
                                    <NavItem href="/accounting-entries" icon={CreditCard}>
                                        Lançamentos Contábeis
                                    </NavItem>
                                    <NavItem href="/cost-centers" icon={Wallet}>
                                        Centro de Custo
                                    </NavItem>
                                    <NavItem href="#" icon={Receipt}>
                                        Unidades de Negócio
                                    </NavItem>

                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Modulos
                                </div>

                                <div className="space-y-10 mb-4">
                                    <CollapsibleNavItem
                                        id="compras"
                                        icon={BaggageClaim}
                                        subItems={[
                                            { href: "/suppliers", icon: Truck, label: "Fornecedores" },
                                            { href: "/buying/concluidos", icon: ShoppingCart, label: "Inventário" },
                                            { href: "/buying/equipes", icon: BaggageClaim, label: "Requisição de Compra" },
                                            { href: "/buying/equipes", icon: ShoppingBag, label: "Ordem de Compra" }
                                        ]}
                                    >
                                        Compras
                                    </CollapsibleNavItem>
                                </div>

                                <div className="space-y-10 mb-4">
                                    <CollapsibleNavItem
                                        id="financial"
                                        icon={HandCoins}
                                        subItems={[
                                            { href: "/financial/ativos", icon: Target, label: "Projetos Ativos" },
                                            { href: "/financial/concluidos", icon: Calendar, label: "Projetos Concluídos" },
                                            { href: "/financial/cronograma", icon: Clock, label: "Cronograma" },
                                            { href: "/financial/equipes", icon: Users2, label: "Equipes" }
                                        ]}
                                    >
                                        Financeiro
                                    </CollapsibleNavItem>
                                </div>

                                <div className="space-y-10 mb-4">
                                    <CollapsibleNavItem
                                        id="projects"
                                        icon={FolderOpen}
                                        subItems={[
                                            { href: "/projects/ativos", icon: Target, label: "Projetos Ativos" },
                                            { href: "/projects/concluidos", icon: Calendar, label: "Projetos Concluídos" },
                                            { href: "/projects/cronograma", icon: Clock, label: "Cronograma" },
                                            { href: "/projects/equipes", icon: Users2, label: "Equipes" }
                                        ]}
                                    >
                                        Projetos
                                    </CollapsibleNavItem>
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
