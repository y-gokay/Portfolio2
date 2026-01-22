"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteSettingsManager } from "@/components/admin/site-settings-manager";
type TabId = "settings";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category?: "content";
}

const navItems: NavItem[] = [
  {
    id: "settings",
    label: "Genel Ayarlar",
    icon: Settings,
    category: "content",
  },
];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    router.push("/");
  };

  const renderContent = () => {
    return <SiteSettingsManager />;
  };

  const contentItems = navItems.filter((item) => item.category === "content");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Yönetim Paneli</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Web sitenizi yönetin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="hidden sm:flex"
            >
              Ana Sayfa
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            w-64 bg-card border-r
            transform transition-transform duration-200 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            pt-16 lg:pt-0 overflow-y-auto
          `}
        >
          <nav className="p-4 space-y-6">
            {/* İçerik Yönetimi */}
            <div>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                İçerik Yönetimi
              </h2>
              <div className="space-y-1">
                {contentItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg
                        transition-colors
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent text-foreground"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
