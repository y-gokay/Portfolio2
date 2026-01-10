"use client";

import { useRouter } from "next/navigation";
import { LogOut, FolderKanban, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { SiteSettingsManager } from "@/components/admin/site-settings-manager";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Site Yönetim Paneli</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/")}>
              Ana Sayfa
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış Yap
            </Button>
          </div>
        </div>

        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="portfolio">
              <FolderKanban className="mr-2 h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Site Ayarları
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <PortfolioManager />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SiteSettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

