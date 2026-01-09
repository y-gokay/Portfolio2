import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-serif text-primary mb-4">404</h1>
        <h2 className="text-3xl font-serif mb-4">Sayfa Bulunamadı</h2>
        <p className="text-muted-foreground mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Ana Sayfa
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Geri Dön
          </button>
        </div>
      </motion.div>
    </div>
  );
}
