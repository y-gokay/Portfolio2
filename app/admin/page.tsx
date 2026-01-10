"use client";

import { useRouter } from "next/navigation";
import { LogOut, FolderKanban, Settings, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { SiteSettingsManager } from "@/components/admin/site-settings-manager";
import { MediaGallery } from "@/components/admin/media-gallery";

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Site Yönetim Paneli</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Web sitenizin içeriğini buradan yönetin
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => router.push("/")} size="sm" className="text-xs sm:text-sm">
              Ana Sayfa
            </Button>
            <Button variant="outline" onClick={handleLogout} size="sm" className="text-xs sm:text-sm">
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-1 sm:gap-2 h-auto">
            <TabsTrigger value="portfolio" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <FolderKanban className="h-4 w-4" />
              <span>Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <ImageIcon className="h-4 w-4" />
              <span>Galeri</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm">
              <Settings className="h-4 w-4" />
              <span>Ayarlar</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-4 sm:mt-6">
            <TabsContent value="portfolio" className="mt-0">
              <PortfolioManager />
            </TabsContent>

            <TabsContent value="gallery" className="mt-0">
              <MediaGallery />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SiteSettingsManager />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

