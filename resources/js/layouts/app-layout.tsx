import {  useEffect, useState } from 'react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { Search, Bell, Home, Workflow, BarChart3, Settings, Users, Database, ArrowRight, Menu } from "lucide-react"
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Head, Link, usePage } from '@inertiajs/react';
import Sidebar from './app/sidebar';
import Image from '@/components/app/image';
import { Toaster, toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

//export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
//    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
//        {children}
//    </AppLayoutTemplate>
//);


export default function AppLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { props } = usePage();

    useEffect(() => {
        document.documentElement.classList.remove('dark')
        return () => {
            document.documentElement.classList.add('dark')
        }
    }, [])

    // Handle flash messages
    useEffect(() => {
        const flash = props.flash as any;

        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }

        if (flash?.warning) {
            toast.warning(flash.warning);
        }

        if (flash?.info) {
            toast.info(flash.info);
        }
    }, [props.flash])

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="bg-primary flex h-16 items-center justify-between   px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Mobile menu toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white md:hidden  hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    <Link href="/dashboard" className="flex items-center">
                        <Image
                            src="/assets/logo.png"
                            alt="Logo"
                            width={128}
                            height={32}
                        />
                    </Link>
                    <nav className="hidden text-sm text-muted-foreground md:flex">
                        {breadcrumbs.map((bc, idx) => (
                            <span key={idx} className="flex items-center">
                                {idx > 0 && <span className="mx-1 text-muted-foreground">/</span>}
                                {bc.href ? (
                                    <Link href={bc.href} className="capitalize hover:underline hover:text-primary transition-colors">
                                        {bc.label}
                                    </Link>
                                ) : (
                                    <span className="capitalize text-foreground">{bc.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative text-white hover:bg-accent hover:text-accent-foreground">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                    <AvatarFallback className="bg-secondary text-secondary-foreground">GG</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Gabriel Gobbi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-20 w-68 transform bg-sidebar border-r border-sidebar-border shadow-md transition-transform md:relative md:translate-x-0 md:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <nav className="h-full overflow-y-auto">
                        <Sidebar />
                    </nav>
                </aside>

                {/* Overlay for mobile when sidebar open */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-10 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-background">
                    {breadcrumbs.length > 0 && (
                        <nav className="mb-4 text-sm text-muted-foreground md:hidden">
                            {breadcrumbs.map((bc, idx) => (
                                <span key={idx} className="flex items-center">
                                    {idx > 0 && <span className="mx-1 text-muted-foreground">/</span>}
                                    {bc.href ? (
                                        <Link href={bc.href} className="capitalize hover:underline hover:text-primary transition-colors">
                                            {bc.label}
                                        </Link>
                                    ) : (
                                        <span className="capitalize text-foreground">{bc.label}</span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
}
